// Unit tests for address search and reverse geocoding (F-005). Nominatim is replaced by a fake,
// so no network is needed and the real service is never called.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createGeocoder } = require('../src/modules/geocoding/geocoding.service');

const FER = {
  name: 'Fakultet elektrotehnike i računarstva',
  display_name: 'Fakultet elektrotehnike i računarstva, 3, Unska ulica, Trnje, Zagreb, 10000, Hrvatska',
  lat: '45.8011',
  lon: '15.9709',
};

// Fake fetch that records every call and answers with `body` (or throws / returns `status`).
function fakeNominatim({ body = [FER], status = 200, fail = false } = {}) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url: new URL(url), options });
    if (fail) throw new Error('network down');
    return { ok: status >= 200 && status < 300, status, json: async () => body };
  };
  return { fetchImpl, calls };
}

// Fake clock: sleep() moves time forward instead of waiting.
function fakeClock() {
  let time = 1_000_000;
  const sleeps = [];
  return {
    now: () => time,
    sleep: async (ms) => {
      sleeps.push(ms);
      time += ms;
    },
    advance: (ms) => {
      time += ms;
    },
    sleeps,
  };
}

function geocoder(nominatim, clock = fakeClock(), extra = {}) {
  return createGeocoder({
    fetchImpl: nominatim.fetchImpl,
    baseUrl: 'https://nominatim.test',
    userAgent: 'LostAndFound-test',
    countryCodes: 'hr',
    now: clock.now,
    sleep: clock.sleep,
    ...extra,
  });
}

async function rejectsWith(promise, status, detailKey) {
  await assert.rejects(promise, (err) => {
    assert.equal(err.status, status);
    if (detailKey) assert.ok(err.details?.[detailKey], `expected details.${detailKey}`);
    return true;
  });
}

test('search returns name, label and numeric coordinates', async () => {
  const nominatim = fakeNominatim();
  const results = await geocoder(nominatim).searchAddress('  Unska 3,   Zagreb ');
  assert.deepEqual(results, [
    {
      name: 'Fakultet elektrotehnike i računarstva',
      label: FER.display_name,
      latitude: 45.8011,
      longitude: 15.9709,
    },
  ]);
});

test('search sends the usage-policy parameters and User-Agent', async () => {
  const nominatim = fakeNominatim();
  await geocoder(nominatim).searchAddress('Unska 3, Zagreb');
  const { url, options } = nominatim.calls[0];
  assert.equal(url.origin + url.pathname, 'https://nominatim.test/search');
  assert.equal(url.searchParams.get('q'), 'Unska 3, Zagreb');
  assert.equal(url.searchParams.get('format'), 'jsonv2');
  assert.equal(url.searchParams.get('limit'), '5');
  assert.equal(url.searchParams.get('countrycodes'), 'hr');
  assert.equal(options.headers['User-Agent'], 'LostAndFound-test');
});

test('search name falls back to the start of the address and fits locations.name', async () => {
  const unnamed = { name: '', display_name: '3, Unska ulica, Trnje, Zagreb', lat: '45.8', lon: '15.97' };
  const long = { name: 'x'.repeat(150), display_name: 'y', lat: '45.8', lon: '15.97' };
  const results = await geocoder(fakeNominatim({ body: [unnamed, long] })).searchAddress('Unska');
  assert.equal(results[0].name, '3, Unska ulica');
  assert.equal(results[1].name.length, 100);
});

test('search skips results without valid coordinates', async () => {
  const broken = { name: 'Nowhere', display_name: 'Nowhere', lat: 'abc', lon: '15' };
  const results = await geocoder(fakeNominatim({ body: [broken, FER] })).searchAddress('FER');
  assert.equal(results.length, 1);
  assert.equal(results[0].latitude, 45.8011);
});

test('search with no matches returns an empty list', async () => {
  assert.deepEqual(await geocoder(fakeNominatim({ body: [] })).searchAddress('qwertzuiop'), []);
});

test('search rejects a missing, blank or too long query without calling Nominatim', async () => {
  const nominatim = fakeNominatim();
  const g = geocoder(nominatim);
  await rejectsWith(g.searchAddress(undefined), 400, 'q');
  await rejectsWith(g.searchAddress('   '), 400, 'q');
  await rejectsWith(g.searchAddress('a'.repeat(201)), 400, 'q');
  assert.equal(nominatim.calls.length, 0);
});

test('the same search is answered from the cache (case and spaces ignored)', async () => {
  const nominatim = fakeNominatim();
  const g = geocoder(nominatim);
  await g.searchAddress('Unska 3, Zagreb');
  const second = await g.searchAddress('  unska 3,  ZAGREB ');
  assert.equal(nominatim.calls.length, 1);
  assert.equal(second[0].latitude, 45.8011);
});

test('requests to Nominatim are spaced out, even when they arrive together', async () => {
  // Real timers with a 50 ms interval instead of the real 1.1 s, to keep the test fast
  const nominatim = fakeNominatim();
  const sentAt = [];
  const g = createGeocoder({
    fetchImpl: (url, options) => {
      sentAt.push(Date.now());
      return nominatim.fetchImpl(url, options);
    },
    baseUrl: 'https://nominatim.test',
    minIntervalMs: 50,
  });
  await Promise.all([g.searchAddress('a'), g.searchAddress('b'), g.searchAddress('c')]);
  assert.equal(sentAt.length, 3);
  assert.ok(sentAt[1] - sentAt[0] >= 49, `gap ${sentAt[1] - sentAt[0]} ms`);
  assert.ok(sentAt[2] - sentAt[1] >= 49, `gap ${sentAt[2] - sentAt[1]} ms`);
});

test('after a quiet second the next request goes out without waiting', async () => {
  const clock = fakeClock();
  const g = geocoder(fakeNominatim(), clock);
  await g.searchAddress('a');
  clock.advance(1100);
  await g.searchAddress('b');
  assert.deepEqual(clock.sleeps, []);
});

test('a request that would wait more than 5 s gets 503 instead of queueing', async () => {
  const nominatim = fakeNominatim();
  const clock = fakeClock();
  // Hold the fake clock still while requests queue, like a burst arriving at the same moment
  const g = geocoder(nominatim, clock, { sleep: async () => {} });
  const burst = Array.from({ length: 7 }, (_, i) => g.searchAddress(`q${i}`).then(() => 'ok', (e) => e.status));
  const outcomes = await Promise.all(burst);
  assert.deepEqual(outcomes, ['ok', 'ok', 'ok', 'ok', 'ok', 503, 503]);
  assert.equal(nominatim.calls.length, 5);
});

test('Nominatim down, timing out or answering an error -> 503, and the failure is not cached', async () => {
  await rejectsWith(geocoder(fakeNominatim({ fail: true })).searchAddress('FER'), 503);
  await rejectsWith(geocoder(fakeNominatim({ status: 429 })).searchAddress('FER'), 503);

  const flaky = fakeNominatim({ status: 500 });
  const g = geocoder(flaky);
  await rejectsWith(g.searchAddress('FER'), 503);
  await rejectsWith(g.searchAddress('FER'), 503);
  assert.equal(flaky.calls.length, 2);
});

test('reverse returns the place name and full address', async () => {
  const nominatim = fakeNominatim({ body: FER });
  const result = await geocoder(nominatim).reverse('45.801123456', '15.9709');
  assert.deepEqual(result, { name: 'Fakultet elektrotehnike i računarstva', label: FER.display_name });
  const { url } = nominatim.calls[0];
  assert.equal(url.pathname, '/reverse');
  assert.equal(url.searchParams.get('lat'), '45.80112'); // rounded to about 1 m
  assert.equal(url.searchParams.get('zoom'), '18');
});

test('reverse with nothing mapped there returns nulls', async () => {
  const result = await geocoder(fakeNominatim({ body: { error: 'Unable to geocode' } })).reverse('43', '16');
  assert.deepEqual(result, { name: null, label: null });
});

test('reverse rejects invalid coordinates without calling Nominatim', async () => {
  const nominatim = fakeNominatim({ body: FER });
  const g = geocoder(nominatim);
  await rejectsWith(g.reverse('91', '15'), 400, 'lat');
  await rejectsWith(g.reverse('45', '-181'), 400, 'lon');
  await rejectsWith(g.reverse('45.8abc', '15'), 400, 'lat');
  await rejectsWith(g.reverse(undefined, undefined), 400, 'lon');
  assert.equal(nominatim.calls.length, 0);
});

test('nearby reverse lookups share a cache entry', async () => {
  const nominatim = fakeNominatim({ body: FER });
  const g = geocoder(nominatim);
  await g.reverse('45.801100', '15.970900');
  await g.reverse('45.801101', '15.970901');
  assert.equal(nominatim.calls.length, 1);
});

test('cached results expire after a day', async () => {
  const nominatim = fakeNominatim();
  const clock = fakeClock();
  const g = geocoder(nominatim, clock);
  await g.searchAddress('FER');
  clock.advance(24 * 60 * 60 * 1000 + 1);
  await g.searchAddress('FER');
  assert.equal(nominatim.calls.length, 2);
});
