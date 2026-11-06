// Integration tests for GET /api/items against a real database.
// Skipped unless TEST_DATABASE_URL points to a database with schema.sql, seed.sql
// and database/dev/sample-data.sql loaded, for example:
//   TEST_DATABASE_URL=postgres://dbuser:password@localhost:5432/appdb npm test
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

const dbUrl = process.env.TEST_DATABASE_URL;
const skip = dbUrl ? false : 'TEST_DATABASE_URL not set';

let server;
let baseUrl;
let pool;

async function get(path) {
  const res = await fetch(`${baseUrl}${path}`);
  return { status: res.status, body: await res.json() };
}

before(async () => {
  if (skip) return;
  process.env.DATABASE_URL = dbUrl;
  const { createApp } = require('../src/app');
  pool = require('../src/db/pool');
  const app = createApp({ withSessions: false });
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (skip) return;
  server.close();
  await pool.end();
});

test('lists pending public posts, newest first, with the response shape', { skip }, async () => {
  const { status, body } = await get('/api/items');
  assert.equal(status, 200);
  assert.equal(body.limit, 20);
  assert.equal(body.offset, 0);
  assert.equal(body.total, body.items.length);
  assert.ok(body.items.length > 0);
  assert.ok(body.items.every((item) => item.status === 'pending'));

  const dates = body.items.map((item) => new Date(item.createdAt).getTime());
  assert.deepEqual(dates, [...dates].sort((a, b) => b - a));

  const item = body.items[0];
  for (const key of ['id', 'type', 'title', 'description', 'dateFoundLost', 'category', 'location', 'keywords']) {
    assert.ok(key in item, `missing ${key}`);
  }
  assert.equal(typeof item.location.latitude, 'number');
  assert.match(item.dateFoundLost, /^\d{4}-\d{2}-\d{2}$/);
});

test('never exposes hidden details, authors or removed posts (NF-001)', { skip }, async () => {
  const { body } = await get('/api/items?status=all&limit=100');
  const json = JSON.stringify(body);
  assert.ok(!json.includes('hidden_detail') && !json.includes('hiddenDetail'));
  assert.ok(!json.includes('Scratch on the left ear cup'));
  assert.ok(body.items.every((item) => !('userId' in item) && !('user_id' in item)));
  assert.ok(!body.items.some((item) => item.title === 'Removed sample post'));
});

test('status=all includes handed-over posts', { skip }, async () => {
  const { body } = await get('/api/items?status=all&limit=100');
  assert.ok(body.items.some((item) => item.status === 'handed_over'));
});

test('filters by type and category', { skip }, async () => {
  const lost = await get('/api/items?type=lost');
  assert.ok(lost.body.items.length > 0);
  assert.ok(lost.body.items.every((item) => item.type === 'lost'));

  const categoryId = lost.body.items[0].category.id;
  const byCategory = await get(`/api/items?categoryId=${categoryId}`);
  assert.ok(byCategory.body.items.every((item) => item.category.id === categoryId));
});

test('text search matches partial words, keyword names and "Other" text', { skip }, async () => {
  const partial = await get('/api/items?q=headph');
  assert.ok(partial.body.items.some((item) => item.title.includes('headphones')));

  const other = await get('/api/items?q=mint');
  assert.equal(other.body.items.length, 1);
  assert.ok(other.body.items[0].keywords.some((k) => k.isOther && k.value === 'mint green'));

  const none = await get('/api/items?q=zzzznothing');
  assert.equal(none.body.total, 0);
  assert.deepEqual(none.body.items, []);
});

test('keyword filter requires every selected keyword', { skip }, async () => {
  const { body: all } = await get('/api/items?limit=100');
  const withTwo = all.items.find((item) => item.keywords.filter((k) => k.keywordId).length >= 2);
  const ids = withTwo.keywords.filter((k) => k.keywordId).map((k) => k.keywordId);

  const { body } = await get(`/api/items?keywordIds=${ids.join(',')}`);
  assert.ok(body.items.some((item) => item.id === withTwo.id));
  for (const item of body.items) {
    const itemIds = item.keywords.map((k) => k.keywordId);
    assert.ok(ids.every((id) => itemIds.includes(id)));
  }
});

test('map bounds exclude posts outside the visible area', { skip }, async () => {
  // Box around FER; the sample post at Jarun lake is outside it
  const { body } = await get('/api/items?minLat=45.79&maxLat=45.81&minLng=15.96&maxLng=15.98');
  assert.ok(body.items.length > 0);
  assert.ok(!body.items.some((item) => item.location.name === 'Jarun lake'));
  for (const { location } of body.items) {
    assert.ok(location.latitude >= 45.79 && location.latitude <= 45.81);
    assert.ok(location.longitude >= 15.96 && location.longitude <= 15.98);
  }
});

test('pagination returns consecutive pages and a stable total', { skip }, async () => {
  const first = await get('/api/items?limit=2&offset=0');
  const second = await get('/api/items?limit=2&offset=2');
  assert.equal(first.body.items.length, 2);
  assert.equal(first.body.total, second.body.total);
  const firstIds = first.body.items.map((item) => item.id);
  assert.ok(second.body.items.every((item) => !firstIds.includes(item.id)));

  const beyond = await get(`/api/items?offset=${first.body.total + 10}`);
  assert.deepEqual(beyond.body.items, []);
  assert.equal(beyond.body.total, first.body.total);
});

test('invalid parameters return 400 with details', { skip }, async () => {
  const { status, body } = await get('/api/items?type=stolen&limit=0');
  assert.equal(status, 400);
  assert.ok(body.details.type);
  assert.ok(body.details.limit);
});
