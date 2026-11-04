// Database access for matches. SQL only, no business rules.
// Schema: database/schema.sql
// const pool = require('../../db/pool');

// TODO: SELECT from item_match_scores
async function findScoresForItem(itemId) {
  throw new Error('Not implemented: matchesRepository.findScoresForItem');
}

module.exports = {
  findScoresForItem,
};
