// Creates or updates the database structure and loads the reference data
// (categories, keyword kinds, keywords). Safe to run again: existing data is kept.
//
//   cd backend
//   npm run db:setup                 uses DATABASE_URL from backend/.env
//   npm run db:setup -- --sample     also loads database/dev/sample-data.sql (local databases only)
//
// For the Render database, set DATABASE_URL to its External Database URL
// (Render dashboard > app-db > Connect). Do not commit that URL.
require('dotenv').config({ path: require('node:path').join(__dirname, '..', '.env') });
const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');

const DATABASE_DIR = path.join(__dirname, '..', '..', 'database');
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '::1', 'db'];

function fail(message) {
  console.error(`db:setup: ${message}`);
  process.exit(1);
}

// postgres://user:secret@host/db -> postgres://user:****@host/db
function withoutPassword(url) {
  return url.password ? url.href.replace(`:${url.password}@`, ':****@') : url.href;
}

// Render requires SSL from outside its network; local Docker Postgres has no SSL.
// DB_SSL=true or DB_SSL=false overrides the guess.
function sslFor(url) {
  const setting = process.env.DB_SSL;
  if (setting === 'true') return { rejectUnauthorized: false };
  if (setting === 'false') return false;
  return LOCAL_HOSTS.includes(url.hostname) ? false : { rejectUnauthorized: false };
}

async function runFile(client, relativePath) {
  const file = path.join(DATABASE_DIR, relativePath);
  await client.query(fs.readFileSync(file, 'utf8'));
  console.log(`  applied database/${relativePath}`);
}

async function main() {
  const withSample = process.argv.includes('--sample');
  if (!process.env.DATABASE_URL) {
    fail('DATABASE_URL is not set (backend/.env or the environment).');
  }

  let url;
  try {
    url = new URL(process.env.DATABASE_URL);
  } catch {
    fail('DATABASE_URL is not a valid postgres:// URL.');
  }
  if (withSample && !LOCAL_HOSTS.includes(url.hostname)) {
    fail(`--sample only works on a local database, not on ${url.hostname}.`);
  }

  // Strip ?sslmode=... so the ssl option below is the only SSL setting.
  url.searchParams.delete('sslmode');
  const client = new Client({ connectionString: url.href, ssl: sslFor(url) });
  console.log(`db:setup: ${withoutPassword(url)}`);
  await client.connect();

  try {
    // Each file runs in its own transaction (BEGIN ... COMMIT inside the file),
    // so an error leaves that file's changes out completely.
    await runFile(client, 'schema.sql');
    await runFile(client, 'seed.sql');
    if (withSample) await runFile(client, 'dev/sample-data.sql');

    const { rows } = await client.query(`
      SELECT (SELECT count(*) FROM categories)::int    AS categories,
             (SELECT count(*) FROM keyword_kinds)::int AS "keywordKinds",
             (SELECT count(*) FROM keywords)::int      AS keywords,
             (SELECT count(*) FROM users)::int         AS users,
             (SELECT count(*) FROM items)::int         AS items`);
    console.log('  now in the database:', rows[0]);
  } finally {
    await client.end();
  }
}

main().catch((err) => fail(err.message));
