// Sign-in with Google (OAuth 2.0) and server sessions. F-003, UC-003.
// Controllers translate HTTP <-> service calls.
const authService = require('./auth.service');
const HttpError = require('../../utils/HttpError');
const { SESSION_COOKIE_NAME } = require('../../config/session');

// express-session uses callbacks; wrap them so controllers can await.
function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => (err ? reject(err) : resolve()));
  });
}

function destroySession(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => (err ? reject(err) : resolve()));
  });
}

function toPublicUser(user) {
  return { id: user.id, name: user.name, role: user.role };
}

// POST /api/auth/google  body: { idToken }
async function signInWithGoogle(req, res) {
  const idToken = req.body?.idToken;
  if (typeof idToken !== 'string' || idToken.trim() === '') {
    throw new HttpError(400, 'idToken is required');
  }

  const profile = await authService.verifyGoogleIdToken(idToken);
  const user = await authService.findOrCreateUser(profile);

  // New session id on sign-in, so a session id known before sign-in
  // can never be used to act as the signed-in user (session fixation).
  await regenerateSession(req);
  req.session.user = { id: user.id, role: user.role };

  res.json(toPublicUser(user));
}

// POST /api/auth/logout
async function signOut(req, res) {
  await destroySession(req);
  res.clearCookie(SESSION_COOKIE_NAME);
  res.sendStatus(204);
}

// GET /api/auth/me
async function getCurrentUser(req, res) {
  if (!req.session?.user) {
    throw new HttpError(401, 'Sign-in required');
  }

  const user = await authService.getUserById(req.session.user.id);
  if (!user) {
    // The user was deleted after signing in: end the stale session too.
    await destroySession(req);
    res.clearCookie(SESSION_COOKIE_NAME);
    throw new HttpError(401, 'Sign-in required');
  }

  res.json(toPublicUser(user));
}

module.exports = {
  signInWithGoogle,
  signOut,
  getCurrentUser,
};
