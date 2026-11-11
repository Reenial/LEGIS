// Sign-in with Google (OAuth 2.0) and server sessions. F-003, UC-003.
// Controllers translate HTTP <-> service calls. 
const authService = require('./auth.service');
const HttpError = require('../../utils/HttpError');

// POST /api/auth/google
async function signInWithGoogle(req, res) {
  const idToken = req.body?.idToken;
  const profile = await authService.verifyGoogleIdToken(idToken);
  const user = await authService.findOrCreateUser(profile);
  req.session.user = {id: user.id, role: user.role};
  res.json({id: user.id, name: user.name, role: user.role});
}

// POST /api/auth/logout
function signOut(req, res, next) {
  req.session.destroy((err)=>{
    if(err)
      return next(err);
    res.clearCookie("lf.sid");
    res.sendStatus(204);
  });
}

// GET /api/auth/me
async function getCurrentUser(req, res, next) {
  if (!req.session?.user) {
    return next(new HttpError(401, 'Sign-in required'));
  }
  const user = await authService.getUserById(req.session.user.id);
  res.json({id: user.id, name: user.name, role: user.role});
}
module.exports = {
  signInWithGoogle,
  signOut,
  getCurrentUser,
};
