// Address <-> coordinates through Nominatim (OpenStreetMap), called from the backend (doc 4.2). F-005.
// Business rules and permission checks live here (NF-002), not in controllers.
//
// Nominatim usage policy (https://operations.osmfoundation.org/policies/nominatim/):
//   - at most 1 request per second for the whole application, not per user -> one shared queue
//   - a User-Agent that identifies the application (NOMINATIM_USER_AGENT)    -> sent with every request
//   - caching is encouraged                                                  -> results kept for a day
//   - no search-as-you-type (autocomplete)                                   -> the frontend must only
//     search when the user submits the address, never on every keystroke
//   - the service must be replaceable without a code change                 -> NOMINATIM_URL
const HttpError = require('../../utils/HttpError');
const env = require('../../config/env');

const MAX_QUERY_LENGTH = 200;
const MAX_RESULTS = 5;
const MAX_NAME_LENGTH = 100; // locations.name is varchar(100)
const MIN_INTERVAL_MS = 1100; // a little over 1 s, so clock jitter never breaks the limit
const MAX_WAIT_MS = 5000; // a request that would wait longer gets 503 instead of hanging
const TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_MAX_ENTRIES = 500;

const UNAVAILABLE = 'Address search is unavailable right now. Pick the location on the map instead.';

// Short name for the location field: the place's own name ("Fakultet elektrotehnike i računarstva"),
// otherwise the first two parts of the full address ("3, Unska ulica").
function shortName(place) {
  const name = place.name && String(place.name).trim();
  const text = name || String(place.display_name || '').split(',').slice(0, 2).join(',').trim();
  return text ? text.slice(0, MAX_NAME_LENGTH) : null;
}

function toCoordinate(text, min, max) {
  const n = Number(text);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

// Query string value -> number in range, or null. Accepts only plain decimals ("45.80", "-15.9").
function parseCoordinate(value, min, max) {
  if (Array.isArray(value)) value = value[value.length - 1];
  const text = typeof value === 'string' ? value.trim() : '';
  return /^-?\d+(\.\d+)?$/.test(text) ? toCoordinate(text, min, max) : null;
}

// Options exist for tests (fake fetch and clock); the app uses the defaults.
function createGeocoder({
  fetchImpl = (...args) => globalThis.fetch(...args),
  baseUrl = env.nominatimUrl,
  userAgent = env.nominatimUserAgent,
  countryCodes = env.nominatimCountryCodes,
  minIntervalMs = MIN_INTERVAL_MS,
  maxWaitMs = MAX_WAIT_MS,
  now = () => Date.now(),
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
} = {}) {
  const cache = new Map(); // key -> { value, expires }; Map keeps insertion order, oldest first
  let nextFreeAt = 0; // earliest time the next Nominatim request may start

  function cacheGet(key) {
    const hit = cache.get(key);
    if (!hit) return undefined;
    if (hit.expires <= now()) {
      cache.delete(key);
      return undefined;
    }
    return hit.value;
  }

  function cacheSet(key, value) {
    if (cache.size >= CACHE_MAX_ENTRIES) cache.delete(cache.keys().next().value);
    cache.set(key, { value, expires: now() + CACHE_TTL_MS });
  }

  // Reserves the next free 1-second slot. Reservation is synchronous, so concurrent
  // requests line up one after another instead of all starting at once.
  async function waitForSlot() {
    const current = now();
    const startAt = Math.max(current, nextFreeAt);
    if (startAt - current > maxWaitMs) {
      throw new HttpError(503, 'Address search is busy. Please try again in a few seconds.');
    }
    nextFreeAt = startAt + minIntervalMs;
    if (startAt > current) await sleep(startAt - current);
  }

  async function callNominatim(path, params) {
    await waitForSlot();
    const url = new URL(path, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
    Object.entries({ format: 'jsonv2', ...params }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
    });

    let response;
    try {
      response = await fetchImpl(url, {
        headers: { 'User-Agent': userAgent, 'Accept-Language': 'hr,en' },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (err) {
      console.error('Nominatim request failed:', err.message);
      throw new HttpError(503, UNAVAILABLE);
    }
    if (!response.ok) {
      console.error(`Nominatim answered ${response.status} for ${url.pathname}`);
      throw new HttpError(503, UNAVAILABLE);
    }
    try {
      return await response.json();
    } catch {
      throw new HttpError(503, UNAVAILABLE);
    }
  }

  // GET /api/geocode?q=  ->  [{ name, label, latitude, longitude }], best match first, at most 5
  async function searchAddress(rawQuery) {
    const value = Array.isArray(rawQuery) ? rawQuery[rawQuery.length - 1] : rawQuery;
    const q = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
    if (!q) throw new HttpError(400, 'Invalid query parameters', { q: 'Required' });
    if (q.length > MAX_QUERY_LENGTH) {
      throw new HttpError(400, 'Invalid query parameters', { q: `At most ${MAX_QUERY_LENGTH} characters` });
    }

    const key = `search:${q.toLowerCase()}`;
    const cached = cacheGet(key);
    if (cached) return cached;

    const places = await callNominatim('search', {
      q,
      limit: MAX_RESULTS,
      countrycodes: countryCodes,
    });
    const results = (Array.isArray(places) ? places : [])
      .map((place) => ({
        name: shortName(place),
        label: place.display_name || null,
        latitude: toCoordinate(place.lat, -90, 90),
        longitude: toCoordinate(place.lon, -180, 180),
      }))
      .filter((r) => r.latitude !== null && r.longitude !== null);

    cacheSet(key, results);
    return results;
  }

  // GET /api/geocode/reverse?lat=&lon=  ->  { name, label }; both null where nothing is mapped
  async function reverse(rawLat, rawLon) {
    const latitude = parseCoordinate(rawLat, -90, 90);
    const longitude = parseCoordinate(rawLon, -180, 180);
    const errors = {};
    if (latitude === null) errors.lat = 'Number between -90 and 90';
    if (longitude === null) errors.lon = 'Number between -180 and 180';
    if (Object.keys(errors).length > 0) throw new HttpError(400, 'Invalid query parameters', errors);

    // About 1 m precision: nearby clicks share a cache entry and need no new request
    const lat = latitude.toFixed(5);
    const lon = longitude.toFixed(5);
    const key = `reverse:${lat},${lon}`;
    const cached = cacheGet(key);
    if (cached) return cached;

    const place = await callNominatim('reverse', { lat, lon, zoom: 18 });
    const result = place && !place.error
      ? { name: shortName(place), label: place.display_name || null }
      : { name: null, label: null }; // Nominatim answers { error: "Unable to geocode" } at sea etc.

    cacheSet(key, result);
    return result;
  }

  return { searchAddress, reverse };
}

// One shared instance, so the 1 request/second limit and the cache cover the whole app.
const geocoder = createGeocoder();

module.exports = {
  searchAddress: geocoder.searchAddress,
  reverse: geocoder.reverse,
  createGeocoder,
};
