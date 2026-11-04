// Sign-in with Google (OAuth 2.0) and server sessions. F-003, UC-003.
// Controllers translate HTTP <-> service calls. Every handler is a stub for now.
const notImplemented = require('../../utils/notImplemented');

// POST /api/auth/google
const signInWithGoogle = notImplemented('UC-003', 'Verify Google ID token, find or create user, start session');

// POST /api/auth/logout
const signOut = notImplemented('UC-003', 'Destroy the session');

// GET /api/auth/me
const getCurrentUser = notImplemented('UC-003', 'Return the signed-in user or 401');

module.exports = {
  signInWithGoogle,
  signOut,
  getCurrentUser,
};
