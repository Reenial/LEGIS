// Database access for messages. SQL only, no business rules.
// Schema: database/schema.sql
// const pool = require('../../db/pool');

// TODO: SELECT from messages ORDER BY created_at
async function findByClaim(claimId) {
  throw new Error('Not implemented: messagesRepository.findByClaim');
}

// TODO: INSERT into messages
async function insert(message) {
  throw new Error('Not implemented: messagesRepository.insert');
}

module.exports = {
  findByClaim,
  insert,
};
