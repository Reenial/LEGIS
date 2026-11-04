// Private messages between requester and post author, scoped to a claim. F-011, UC-010.
// Business rules and permission checks live here (NF-002), not in controllers.
// const HttpError = require('../../utils/HttpError');
// const messagesRepository = require('./messages.repository');

// TODO: Check participant, return messages
async function listForParticipant(userId, claimId) {
  throw new Error('Not implemented: messages.listForParticipant');
}

// TODO: Check participant, validate, save
async function send(userId, claimId, text) {
  throw new Error('Not implemented: messages.send');
}

module.exports = {
  listForParticipant,
  send,
};
