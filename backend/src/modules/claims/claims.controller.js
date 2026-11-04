// Return requests (claims table). F-008 to F-010. UC-007 to UC-009.
// Controllers translate HTTP <-> service calls. Every handler is a stub for now.
const notImplemented = require('../../utils/notImplemented');

// POST /api/items/:itemId/claims
const submitClaim = notImplemented('UC-007', 'Submit a return request for a found item');

// GET /api/claims
const listMyClaims = notImplemented('UC-009', 'Sent and received requests (?role=sent|received)');

// GET /api/claims/:claimId
const getClaim = notImplemented('UC-008', 'Request details for its participants only');

// PATCH /api/claims/:claimId/decision
const decideClaim = notImplemented('UC-008', 'Post author accepts or rejects ({ decision })');

// PATCH /api/claims/:claimId/withdraw
const withdrawClaim = notImplemented('UC-009', 'Requester withdraws the request');

module.exports = {
  submitClaim,
  listMyClaims,
  getClaim,
  decideClaim,
  withdrawClaim,
};
