// Private messages between requester and post author, scoped to a claim. F-011, UC-010.
// Controllers translate HTTP <-> service calls. Every handler is a stub for now.
const notImplemented = require('../../utils/notImplemented');

// GET /api/claims/:claimId/messages
const listMessages = notImplemented('UC-010', 'Conversation for a request (participants only)');

// POST /api/claims/:claimId/messages
const sendMessage = notImplemented('UC-010', 'Send a message in the conversation');

module.exports = {
  listMessages,
  sendMessage,
};
