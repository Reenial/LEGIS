// Sign-in with Google (OAuth 2.0) and server sessions. F-003, UC-003.
// Business rules and permission checks live here (NF-002), not in controllers.
const HttpError = require('../../utils/HttpError');
const authRepository = require('./auth.repository');

// TODO: Verify the token with google-auth-library (audience = GOOGLE_CLIENT_ID)
async function verifyGoogleIdToken(idToken) {
  throw new Error('Not implemented: auth.verifyGoogleIdToken');
}

// TODO: Look up users by (identity_provider, provider_user_id); insert on first sign-in
async function findOrCreateUser(googleProfile) {
  const existingUser= await authRepository.findByProviderId('google', googleProfile.sub);

  if(existingUser){
    return existingUser;
  }

  const newUser = await authRepository.create({
    name: googleProfile.name,
    email:googleProfile.email,
    identity_provider: 'google',
    provider_user_id: googleProfile.sub,
  });
  return newUser;
  //throw new Error('Not implemented: auth.findOrCreateUser');
}

async function getUserById(id) {
  const user = await authRepository.findById(id);
  if (!user) {
    throw new HttpError(401, 'need Sign-in');
  }
  return user;
}

module.exports = {
  verifyGoogleIdToken,
  findOrCreateUser,
  getUserById,
};
