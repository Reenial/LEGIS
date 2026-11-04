// Database access for auth. SQL only, no business rules.
// Schema: database/schema.sql
// const pool = require('../../db/pool');

// TODO: SELECT from users
async function findByProviderId(provider, providerUserId) {
  throw new Error('Not implemented: authRepository.findByProviderId');
}

// TODO: INSERT into users
async function create(user) {
  throw new Error('Not implemented: authRepository.create');
}

// TODO: SELECT from users
async function findById(id) {
  throw new Error('Not implemented: authRepository.findById');
}

module.exports = {
  findByProviderId,
  create,
  findById,
};
