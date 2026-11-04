// Central place for reading environment variables.
require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 10000,
  databaseUrl: process.env.DATABASE_URL,
  sessionSecret: process.env.SESSION_SECRET || 'dev-only-secret',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  nominatimUserAgent: process.env.NOMINATIM_USER_AGENT || 'LostAndFound-FER-student-project',
};

env.isProduction = env.nodeEnv === 'production';

module.exports = env;
