// Database access for items. SQL only, no business rules.
// Schema: database/schema.sql
// const pool = require('../../db/pool');

// TODO: SELECT from items_public
async function search(filters) {
  throw new Error('Not implemented: itemsRepository.search');
}

// TODO: SELECT from items WHERE user_id AND removed_at IS NULL
async function findByAuthor(userId) {
  throw new Error('Not implemented: itemsRepository.findByAuthor');
}

// TODO: SELECT from items_public
async function findPublicById(itemId) {
  throw new Error('Not implemented: itemsRepository.findPublicById');
}

// TODO: SELECT from items (includes hidden_detail; internal use only)
async function findById(itemId) {
  throw new Error('Not implemented: itemsRepository.findById');
}

// TODO: INSERT into items
async function insert(client, item) {
  throw new Error('Not implemented: itemsRepository.insert');
}

// TODO: UPDATE items
async function update(itemId, fields) {
  throw new Error('Not implemented: itemsRepository.update');
}

// TODO: UPDATE items SET removed_at, removed_by
async function markRemoved(itemId, removedBy) {
  throw new Error('Not implemented: itemsRepository.markRemoved');
}

// TODO: DELETE + INSERT item_keywords
async function replaceKeywords(client, itemId, keywords) {
  throw new Error('Not implemented: itemsRepository.replaceKeywords');
}

module.exports = {
  search,
  findByAuthor,
  findPublicById,
  findById,
  insert,
  update,
  markRemoved,
  replaceKeywords,
};
