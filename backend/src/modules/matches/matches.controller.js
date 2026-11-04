// Possible lost/found matches. F-012, UC-011. Keyword scoring via the item_match_scores view.
// Controllers translate HTTP <-> service calls. Every handler is a stub for now.
const notImplemented = require('../../utils/notImplemented');

// GET /api/items/:itemId/matches
const listMatches = notImplemented('UC-011', 'Suggested matches for the user\'s own post');

module.exports = {
  listMatches,
};
