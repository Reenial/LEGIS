// Possible lost/found matches. F-012, UC-011. Keyword scoring via the item_match_scores view.
// Business rules and permission checks live here (NF-002), not in controllers.
// const HttpError = require('../../utils/HttpError');
// const matchesRepository = require('./matches.repository');

// TODO: Check ownership, read item_match_scores, apply threshold (not agreed yet)
async function findMatchesForItem(userId, itemId) {
  throw new Error('Not implemented: matches.findMatchesForItem');
}

module.exports = {
  findMatchesForItem,
};
