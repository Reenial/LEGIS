// Shared PostgreSQL connection pool. Repositories import this.
// Schema: ../../../database/schema.sql
const { Pool } = require('pg');
const env = require('../config/env');

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.isProduction ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
