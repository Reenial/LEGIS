// Database access for auth. SQL only, no business rules.
// Schema: database/schema.sql
const pool = require('../../db/pool');

// TODO: SELECT from users
async function findByProviderId(provider, providerUserId) {
  const result = await pool.query(
    'SELECT id, name, email, role FROM users WHERE identity_provider = $1 AND provider_user_id = $2',
    [provider,providerUserId]
  );
  return result.rows[0] || null
  //throw new Error('Not implemented: authRepository.findByProviderId');
}

// TODO: INSERT into users
async function create(user) {
  const result = await pool.query(
    'INSERT INTO users (name, email, identity_provider, provider_user_id) VALUES ($1, $2, $3, $4) RETURNING id,name,email, role',
    [user.name, user.email, user.identity_provider, user.provider_user_id]
  );
  return result.rows[0];
  //throw new Error('Not implemented: authRepository.create');
}

// TODO: SELECT from users
async function findById(id) {
  const result = await pool.query(
    'SELECT id,name,email,role FROM users WHERE id=$1',
    [id]
  );
  return result.rows[0] || null;
  //throw new Error('Not implemented: authRepository.findById');
}

module.exports = {
  findByProviderId,
  create,
  findById,
};
