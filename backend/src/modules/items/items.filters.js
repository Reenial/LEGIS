// Parses and validates the query string of GET /api/items (F-001, UC-001).
// Returns a clean filters object or throws HttpError 400 listing every invalid parameter.
const HttpError = require('../../utils/HttpError');

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const MAX_QUERY_LENGTH = 100;
const TYPES = ['lost', 'found'];
const STATUSES = ['pending', 'handed_over', 'all'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function single(value) {
  // ?type=a&type=b arrives as an array; only the keyword list accepts repeats
  return Array.isArray(value) ? value[value.length - 1] : value;
}

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

function parsePositiveInt(value) {
  if (!/^\d+$/.test(String(value).trim())) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

function parseDate(value) {
  const text = String(value).trim();
  if (!DATE_RE.test(text)) return null;
  const date = new Date(`${text}T00:00:00Z`);
  // Rejects impossible dates such as 2026-02-30
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(text) ? text : null;
}

function parseNumberInRange(value, min, max) {
  const text = String(value).trim();
  if (!/^-?\d+(\.\d+)?$/.test(text)) return null;
  const n = Number(text);
  return n >= min && n <= max ? n : null;
}

function parseItemFilters(query = {}) {
  const errors = {};
  const filters = {
    q: null,
    type: null,
    categoryId: null,
    keywordIds: [],
    dateFrom: null,
    dateTo: null,
    bounds: null,
    status: 'pending',
    limit: DEFAULT_LIMIT,
    offset: 0,
  };

  // Free-text search over title, description, keyword names and "Other" text
  const q = single(query.q);
  if (!isBlank(q)) {
    const text = String(q).trim();
    if (text.length > MAX_QUERY_LENGTH) errors.q = `At most ${MAX_QUERY_LENGTH} characters`;
    else filters.q = text;
  }

  const type = single(query.type);
  if (!isBlank(type)) {
    if (TYPES.includes(type)) filters.type = type;
    else errors.type = `One of: ${TYPES.join(', ')}`;
  }

  const categoryId = single(query.categoryId);
  if (!isBlank(categoryId)) {
    const id = parsePositiveInt(categoryId);
    if (id) filters.categoryId = id;
    else errors.categoryId = 'Positive integer';
  }

  // ?keywordIds=1,5 or ?keywordIds=1&keywordIds=5; a post must have all of them
  if (!isBlank(query.keywordIds)) {
    const raw = [].concat(query.keywordIds).join(',').split(',').filter((s) => s.trim() !== '');
    const ids = raw.map(parsePositiveInt);
    if (ids.some((id) => id === null)) errors.keywordIds = 'Comma-separated positive integers';
    else if (ids.length > 20) errors.keywordIds = 'At most 20 keywords';
    else filters.keywordIds = [...new Set(ids)];
  }

  // Date the item was lost or found (items.date_found_lost), inclusive
  for (const key of ['dateFrom', 'dateTo']) {
    const value = single(query[key]);
    if (isBlank(value)) continue;
    const date = parseDate(value);
    if (date) filters[key] = date;
    else errors[key] = 'Date in YYYY-MM-DD format';
  }
  if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) {
    errors.dateTo = 'Must not be before dateFrom';
  }

  // Visible map area: all four bounds or none
  const boundKeys = ['minLat', 'maxLat', 'minLng', 'maxLng'];
  const given = boundKeys.filter((key) => !isBlank(single(query[key])));
  if (given.length > 0 && given.length < 4) {
    errors.bounds = 'Provide all of minLat, maxLat, minLng, maxLng or none';
  } else if (given.length === 4) {
    const minLat = parseNumberInRange(single(query.minLat), -90, 90);
    const maxLat = parseNumberInRange(single(query.maxLat), -90, 90);
    const minLng = parseNumberInRange(single(query.minLng), -180, 180);
    const maxLng = parseNumberInRange(single(query.maxLng), -180, 180);
    if ([minLat, maxLat, minLng, maxLng].includes(null)) {
      errors.bounds = 'Latitude between -90 and 90, longitude between -180 and 180';
    } else if (minLat > maxLat || minLng > maxLng) {
      errors.bounds = 'Minimum must not be greater than maximum';
    } else {
      filters.bounds = { minLat, maxLat, minLng, maxLng };
    }
  }

  const status = single(query.status);
  if (!isBlank(status)) {
    if (STATUSES.includes(status)) filters.status = status;
    else errors.status = `One of: ${STATUSES.join(', ')}`;
  }

  const limit = single(query.limit);
  if (!isBlank(limit)) {
    const n = parsePositiveInt(limit);
    if (n && n <= MAX_LIMIT) filters.limit = n;
    else errors.limit = `Integer from 1 to ${MAX_LIMIT}`;
  }

  const offset = single(query.offset);
  if (!isBlank(offset)) {
    const text = String(offset).trim();
    const n = Number(text);
    if (/^\d+$/.test(text) && Number.isSafeInteger(n)) filters.offset = n;
    else errors.offset = 'Integer 0 or greater';
  }

  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, 'Invalid query parameters', errors);
  }
  return filters;
}

module.exports = { parseItemFilters, DEFAULT_LIMIT, MAX_LIMIT };
