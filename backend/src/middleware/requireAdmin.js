// F-015 / UC-014: moderation is available only to the administrator role.
const HttpError = require('../utils/HttpError');

function requireAdmin(req, res, next) {
  if (!req.session?.user) {
    return next(new HttpError(401, 'Sign-in required'));
  }
  if (req.session.user.role !== 'admin') {
    return next(new HttpError(403, 'Administrator role required'));
  }
  next();
}

module.exports = requireAdmin;
