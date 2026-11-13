// Tests for sign-in with Google and sessions (UC-003, NF-002).
// No database and no network: the auth service is stubbed and sessions use an in-memory store.
const { test, before, after, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const session = require('express-session');
const { createApp } = require('../src/app');
const authService = require('../src/modules/auth/auth.service');
const HttpError = require('../src/utils/HttpError');

const original = { ...authService };
const ana = { id: 1, name: 'Ana', email: 'ana@example.com', role: 'user' };

let server;
let baseUrl;

before(async () => {
  const app = createApp({ sessionStore: new session.MemoryStore() });
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

afterEach(() => Object.assign(authService, original));

// The controller calls authService.<fn> at request time, so replacing them here is enough.
function stubGoogleUser(user = ana) {
  authService.verifyGoogleIdToken = async (idToken) => {
    if (idToken !== 'valid-token') throw new HttpError(401, 'Invalid Google token');
    return { sub: 'google-sub-1', name: user.name, email: user.email };
  };
  authService.findOrCreateUser = async () => user;
  authService.getUserById = async (id) => (id === user.id ? user : null);
}

function sessionCookie(res) {
  const header = res.headers.get('set-cookie');
  const match = header && header.match(/lf\.sid=[^;]+/);
  return match ? match[0] : null;
}

function signIn(idToken, cookie) {
  return fetch(`${baseUrl}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    body: JSON.stringify(idToken === undefined ? {} : { idToken }),
  });
}

function me(cookie) {
  return fetch(`${baseUrl}/api/auth/me`, { headers: cookie ? { Cookie: cookie } : {} });
}

test('sign-in without an idToken returns 400', async () => {
  stubGoogleUser();
  const res = await signIn(undefined);
  assert.equal(res.status, 400);
  assert.equal(sessionCookie(res), null);
});

test('sign-in with an invalid token returns 401 and no session', async () => {
  stubGoogleUser();
  const res = await signIn('forged-token');
  assert.equal(res.status, 401);
  assert.equal(sessionCookie(res), null);
});

test('sign-in with a valid token returns the user and a session cookie', async () => {
  stubGoogleUser();
  const res = await signIn('valid-token');
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { id: 1, name: 'Ana', role: 'user' });

  const cookie = sessionCookie(res);
  assert.ok(cookie, 'expected an lf.sid cookie');
  assert.match(res.headers.get('set-cookie'), /HttpOnly/i);

  const meRes = await me(cookie);
  assert.equal(meRes.status, 200);
  assert.deepEqual(await meRes.json(), { id: 1, name: 'Ana', role: 'user' });
});

test('GET /api/auth/me without a session returns 401', async () => {
  const res = await me();
  assert.equal(res.status, 401);
});

test('signing in again issues a new session id and drops the old one', async () => {
  stubGoogleUser();
  const first = sessionCookie(await signIn('valid-token'));
  const secondRes = await signIn('valid-token', first);
  const second = sessionCookie(secondRes);

  assert.ok(second);
  assert.notEqual(second, first);
  assert.equal((await me(first)).status, 401);
  assert.equal((await me(second)).status, 200);
});

test('sign-out ends the session', async () => {
  stubGoogleUser();
  const cookie = sessionCookie(await signIn('valid-token'));

  const res = await fetch(`${baseUrl}/api/auth/logout`, { method: 'POST', headers: { Cookie: cookie } });
  assert.equal(res.status, 204);
  assert.equal((await me(cookie)).status, 401);
});

test('sign-out without a session returns 401', async () => {
  const res = await fetch(`${baseUrl}/api/auth/logout`, { method: 'POST' });
  assert.equal(res.status, 401);
});

test('a session for a deleted user is ended by GET /api/auth/me', async () => {
  stubGoogleUser();
  const cookie = sessionCookie(await signIn('valid-token'));

  authService.getUserById = async () => null;
  assert.equal((await me(cookie)).status, 401);

  // Even if the user existed again, the old session must stay gone.
  stubGoogleUser();
  assert.equal((await me(cookie)).status, 401);
});
