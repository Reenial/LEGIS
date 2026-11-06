// Lost/found posts. F-001, F-002, F-004 to F-007. UC-001, UC-002, UC-004 to UC-006.
// Business rules and permission checks live here (NF-002), not in controllers.
// const HttpError = require('../../utils/HttpError');
const itemsRepository = require('./items.repository');
const { parseItemFilters } = require('./items.filters');

// UC-001: public post list with search, filters and pagination.
// `query` is the raw request query string; invalid values throw HttpError 400.
async function searchPublicItems(query) {
  const filters = parseItemFilters(query);
  const { rows, total } = await itemsRepository.search(filters);
  return {
    items: rows,
    total,
    limit: filters.limit,
    offset: filters.offset,
  };
}

// TODO: Return the user's own posts, including hidden_detail and handed-over posts
async function listOwnItems(userId) {
  throw new Error('Not implemented: items.listOwnItems');
}

// TODO: Return public fields only; 404 if removed
async function getPublicItem(itemId) {
  throw new Error('Not implemented: items.getPublicItem');
}

// TODO: Validate input, create location, item and item_keywords in one transaction
async function createItem(userId, data) {
  throw new Error('Not implemented: items.createItem');
}

// TODO: Check authorship, validate, update
async function updateItem(userId, itemId, data) {
  throw new Error('Not implemented: items.updateItem');
}

// TODO: Check authorship, set removed_at and removed_by
async function removeItem(userId, itemId) {
  throw new Error('Not implemented: items.removeItem');
}

// TODO: Check authorship, set status = handed_over
async function markHandedOver(userId, itemId) {
  throw new Error('Not implemented: items.markHandedOver');
}

module.exports = {
  searchPublicItems,
  listOwnItems,
  getPublicItem,
  createItem,
  updateItem,
  removeItem,
  markHandedOver,
};
