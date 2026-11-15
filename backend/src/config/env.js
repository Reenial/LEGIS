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
  nominatimUrl: process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org',
  // Address search only within these countries (comma-separated ISO codes); empty = everywhere
  nominatimCountryCodes: process.env.NOMINATIM_COUNTRY_CODES ?? 'hr',
};

env.isProduction = env.nodeEnv === 'production';

module.exports = env;
