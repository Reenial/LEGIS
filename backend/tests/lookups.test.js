// Integration tests for GET /api/categories and GET /api/keywords against a real database.
// Skipped unless TEST_DATABASE_URL points to a database with schema.sql and seed.sql loaded.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

const dbUrl = process.env.TEST_DATABASE_URL;
const skip = dbUrl ? false : 'TEST_DATABASE_URL not set';

let server;
let baseUrl;
let pool;

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

test('categories are public and match the database', { skip }, async () => {
  const res = await fetch(`${baseUrl}/api/categories`);
  assert.equal(res.status, 200);
  const body = await res.json();
  const { rows } = await pool.query('SELECT id, name FROM categories ORDER BY id');
  assert.deepEqual(body, rows);
});

test('keywords are grouped by kind with the real ids', { skip }, async () => {
  const res = await fetch(`${baseUrl}/api/keywords`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(body.length > 0);
  for (const kind of body) {
    assert.equal(typeof kind.id, 'number');
    assert.equal(typeof kind.name, 'string');
    assert.ok(Array.isArray(kind.keywords));
    const { rows } = await pool.query('SELECT id, name FROM keywords WHERE kind_id = $1 ORDER BY id', [kind.id]);
    assert.deepEqual(kind.keywords, rows);
  }
});
