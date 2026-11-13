// Sign-in with Google (OAuth 2.0) and server sessions. F-003, UC-003.
// Business rules and permission checks live here (NF-002), not in controllers.
const { OAuth2Client } = require('google-auth-library');
const HttpError = require('../../utils/HttpError');
const authRepository = require('./auth.repository');
const env = require('../../config/env');

const GOOGLE_PROVIDER = 'google';
const googleClient = new OAuth2Client(env.googleClientId);

// Verifies the ID token from Google Identity Services (signature, expiry, audience)
// and returns the profile fields we store.
async function verifyGoogleIdToken(idToken) {
  if (!env.googleClientId) {
    throw new HttpError(500, 'Google sign-in is not configured (GOOGLE_CLIENT_ID missing)');
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.googleClientId,
    });
    payload = ticket.getPayload();
  } catch {
    throw new HttpError(401, 'Invalid Google token');
  }

  return {
    sub: payload.sub,
    // users.name is varchar(100)
    name: (payload.name || payload.email || 'Google user').slice(0, 100),
    email: payload.email || null,
  };
}

// Looks the user up by (identity_provider, provider_user_id); creates them on first sign-in.
async function findOrCreateUser(googleProfile) {
  const existingUser = await authRepository.findByProviderId(GOOGLE_PROVIDER, googleProfile.sub);
  if (existingUser) {
    return existingUser;
  }

  return authRepository.create({
    name: googleProfile.name,
    email: googleProfile.email,
    identity_provider: GOOGLE_PROVIDER,
    provider_user_id: googleProfile.sub,
  });
}

// Returns the user or null if they no longer exist.
async function getUserById(id) {
  return authRepository.findById(id);
}

module.exports = {
  verifyGoogleIdToken,
  findOrCreateUser,
  getUserById,
};
