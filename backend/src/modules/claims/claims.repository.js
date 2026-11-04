// Database access for claims. SQL only, no business rules.
// Schema: database/schema.sql
// const pool = require('../../db/pool');

// TODO: INSERT into claims
async function insert(claim) {
  throw new Error('Not implemented: claimsRepository.insert');
}

// TODO: SELECT claim with its item author
async function findById(claimId) {
  throw new Error('Not implemented: claimsRepository.findById');
}

// TODO: SELECT pending/accepted claim
async function findOpenForUserAndItem(userId, itemId) {
  throw new Error('Not implemented: claimsRepository.findOpenForUserAndItem');
}

// TODO: SELECT claims by requester
async function findSentBy(userId) {
  throw new Error('Not implemented: claimsRepository.findSentBy');
}

// TODO: SELECT claims on items authored by user
async function findReceivedBy(userId) {
  throw new Error('Not implemented: claimsRepository.findReceivedBy');
}

// TODO: UPDATE claims SET status, decided_at
async function updateStatus(claimId, status) {
  throw new Error('Not implemented: claimsRepository.updateStatus');
}

module.exports = {
  insert,
  findById,
  findOpenForUserAndItem,
  findSentBy,
  findReceivedBy,
  updateStatus,
};
