// Return requests (claims table). F-008 to F-010. UC-007 to UC-009.
// Business rules and permission checks live here (NF-002), not in controllers.
// const HttpError = require('../../utils/HttpError');
// const claimsRepository = require('./claims.repository');

// TODO: Reject own item, unavailable item, or an existing pending/accepted request; save as pending
async function submitClaim(userId, itemId, message) {
  throw new Error('Not implemented: claims.submitClaim');
}

// TODO: Requests where user is requester or post author
async function listForUser(userId, role) {
  throw new Error('Not implemented: claims.listForUser');
}

// TODO: 403 for non-participants (NF-001)
async function getForParticipant(userId, claimId) {
  throw new Error('Not implemented: claims.getForParticipant');
}

// TODO: Only the post author; allowed while item not handed over; set decided_at
async function decide(userId, claimId, decision) {
  throw new Error('Not implemented: claims.decide');
}

// TODO: Only the requester; withdrawn is final
async function withdraw(userId, claimId) {
  throw new Error('Not implemented: claims.withdraw');
}

module.exports = {
  submitClaim,
  listForUser,
  getForParticipant,
  decide,
  withdraw,
};
