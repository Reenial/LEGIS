// Smoke tests for the skeleton: no database needed (sessions disabled).
// Run with: npm test
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');

let server;
let baseUrl;

before(async () => {
  const app = createApp({ withSessions: false });
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('GET /health returns healthy', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'healthy' });
});

test('public stub route returns 501 with its use case', async () => {
  const res = await fetch(`${baseUrl}/api/items/1`);
  assert.equal(res.status, 501);
  const body = await res.json();
  assert.equal(body.error, 'Not implemented yet...');
  assert.equal(body.useCase, 'UC-002');
});

test('protected route without a session returns 401 (NF-002)', async () => {
  const res = await fetch(`${baseUrl}/api/claims`);
  assert.equal(res.status, 401);
});

test('admin route without a session returns 401', async () => {
  const res = await fetch(`${baseUrl}/api/admin/reports`);
  assert.equal(res.status, 401);
});

test('unknown route returns 404', async () => {
  const res = await fetch(`${baseUrl}/api/does-not-exist`);
  assert.equal(res.status, 404);
});

test('address search requires sign-in (F-005)', async () => {
  for (const path of ['/api/geocode?q=FER', '/api/geocode/reverse?lat=45.8&lon=15.97']) {
    const res = await fetch(`${baseUrl}${path}`);
    assert.equal(res.status, 401, path);
  }
});

test('GET /wake sends the browser back to the website route it came from', async () => {
  const res = await fetch(`${baseUrl}/wake?to=${encodeURIComponent('#/items/42')}`, { redirect: 'manual' });
  assert.equal(res.status, 302);
  assert.match(res.headers.get('location'), /\/#\/items\/42$/);
});

test('GET /wake ignores a target outside the website', async () => {
  const res = await fetch(`${baseUrl}/wake?to=${encodeURIComponent('https://evil.example')}`, { redirect: 'manual' });
  assert.equal(res.status, 302);
  assert.doesNotMatch(res.headers.get('location'), /evil/);
});
