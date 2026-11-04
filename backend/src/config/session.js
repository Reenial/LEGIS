// Server-side sessions stored in the `session` table (see database/schema.sql).
// After sign-in (UC-003) the auth module stores req.session.user = { id, role }.
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const pool = require('../db/pool');
const env = require('./env');

function createSessionMiddleware() {
  return session({
    store: new PgSession({
      pool,
      tableName: 'session',
      createTableIfMissing: false, // table is created by schema.sql
    }),
    name: 'lf.sid',
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // Frontend and backend are separate origins on Render, so production needs
      // SameSite=None + Secure for the cookie to be sent with cross-site requests.
      secure: env.isProduction,
      sameSite: env.isProduction ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  });
}

module.exports = { createSessionMiddleware };
