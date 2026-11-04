// Sign-in with Google (OAuth 2.0) and server sessions. F-003, UC-003.
// Business rules and permission checks live here (NF-002), not in controllers.
// const HttpError = require('../../utils/HttpError');
// const authRepository = require('./auth.repository');

// TODO: Verify the token with google-auth-library (audience = GOOGLE_CLIENT_ID)
async function verifyGoogleIdToken(idToken) {
  throw new Error('Not implemented: auth.verifyGoogleIdToken');
}

// TODO: Look up users by (identity_provider, provider_user_id); insert on first sign-in
async function findOrCreateUser(googleProfile) {
  throw new Error('Not implemented: auth.findOrCreateUser');
}

module.exports = {
  verifyGoogleIdToken,
  findOrCreateUser,
};
