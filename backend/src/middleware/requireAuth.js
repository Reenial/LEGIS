// NF-002: the server checks identity for every protected action.
const HttpError = require('../utils/HttpError');

function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return next(new HttpError(401, 'Sign-in required'));
  }
  next();
}

module.exports = requireAuth;
