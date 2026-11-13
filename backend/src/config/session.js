// Server-side sessions stored in the `session` table (see database/schema.sql).
// After sign-in (UC-003) the auth module stores req.session.user = { id, role }.
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const pool = require('../db/pool');
const env = require('./env');

const SESSION_COOKIE_NAME = 'lf.sid';

// `store` can be replaced in tests (e.g. new session.MemoryStore()).
function createSessionMiddleware({ store } = {}) {
  return session({
    store:
      store ||
      new PgSession({
        pool,
        tableName: 'session',
        createTableIfMissing: false, // table is created by schema.sql
      }),
    name: SESSION_COOKIE_NAME,
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // The frontend's nginx proxies /api to this service (frontend/nginx.conf.template),
      // so the browser only talks to one origin and the cookie is first-party.
      secure: env.isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  });
}

module.exports = { createSessionMiddleware, SESSION_COOKIE_NAME };
