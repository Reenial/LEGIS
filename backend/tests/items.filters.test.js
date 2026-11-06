// Unit tests for GET /api/items query parsing. No database needed.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseItemFilters } = require('../src/modules/items/items.filters');

function errorsFor(query) {
  try {
    parseItemFilters(query);
  } catch (err) {
    assert.equal(err.status, 400);
    return err.details;
  }
  assert.fail('Expected HttpError 400');
}

test('defaults: pending posts, first page of 20', () => {
  const f = parseItemFilters({});
  assert.equal(f.status, 'pending');
  assert.equal(f.limit, 20);
  assert.equal(f.offset, 0);
  assert.deepEqual(f.keywordIds, []);
  assert.equal(f.q, null);
  assert.equal(f.bounds, null);
});

test('parses every valid filter', () => {
  const f = parseItemFilters({
    q: '  black wallet ',
    type: 'found',
    categoryId: '3',
    keywordIds: '1,5,5',
    dateFrom: '2026-10-01',
    dateTo: '2026-10-31',
    minLat: '45.79', maxLat: '45.81', minLng: '15.96', maxLng: '15.98',
    status: 'all',
    limit: '50',
    offset: '100',
  });
  assert.equal(f.q, 'black wallet');
  assert.equal(f.type, 'found');
  assert.equal(f.categoryId, 3);
  assert.deepEqual(f.keywordIds, [1, 5]);
  assert.equal(f.dateFrom, '2026-10-01');
  assert.equal(f.dateTo, '2026-10-31');
  assert.deepEqual(f.bounds, { minLat: 45.79, maxLat: 45.81, minLng: 15.96, maxLng: 15.98 });
  assert.equal(f.status, 'all');
  assert.equal(f.limit, 50);
  assert.equal(f.offset, 100);
});

test('keywordIds also accepts repeated parameters', () => {
  assert.deepEqual(parseItemFilters({ keywordIds: ['2', '7'] }).keywordIds, [2, 7]);
});

test('empty values are ignored', () => {
  const f = parseItemFilters({ q: '   ', type: '', categoryId: '' });
  assert.equal(f.q, null);
  assert.equal(f.type, null);
  assert.equal(f.categoryId, null);
});

test('rejects invalid values and reports each one', () => {
  const errors = errorsFor({
    type: 'stolen',
    categoryId: 'abc',
    keywordIds: '1,x',
    dateFrom: '2026-02-30',
    status: 'removed',
    limit: '500',
    offset: '-1',
  });
  assert.deepEqual(
    Object.keys(errors).sort(),
    ['categoryId', 'dateFrom', 'keywordIds', 'limit', 'offset', 'status', 'type'],
  );
});

test('rejects dateFrom after dateTo', () => {
  assert.ok(errorsFor({ dateFrom: '2026-11-02', dateTo: '2026-11-01' }).dateTo);
});

test('map bounds must be complete, in range and ordered', () => {
  assert.ok(errorsFor({ minLat: '45.7' }).bounds);
  assert.ok(errorsFor({ minLat: '95', maxLat: '96', minLng: '1', maxLng: '2' }).bounds);
  assert.ok(errorsFor({ minLat: '46', maxLat: '45', minLng: '1', maxLng: '2' }).bounds);
});

test('rejects an overly long search query', () => {
  assert.ok(errorsFor({ q: 'a'.repeat(101) }).q);
});
