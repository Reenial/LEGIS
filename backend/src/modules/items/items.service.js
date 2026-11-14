// Lost/found posts. F-001, F-002, F-004 to F-007. UC-001, UC-002, UC-004 to UC-006.
// Business rules and permission checks live here (NF-002), not in controllers.
const HttpError = require('../../utils/HttpError');
const withTransaction = require('../../db/transaction');
const itemsRepository = require('./items.repository');
const { parseItemFilters } = require('./items.filters');
const { parseNewItem } = require('./items.validation');

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

// Checks that the category and keywords exist and that every keyword kind has exactly
// one value (a suggested keyword of that kind or "Other" text). Throws HttpError 400.
async function checkReferences(data, db) {
  const errors = {};

  const [categoryOk, kindIds, foundKeywords] = await Promise.all([
    itemsRepository.categoryExists(data.categoryId, db),
    itemsRepository.findAllKeywordKindIds(db),
    itemsRepository.findKeywordsByIds(
      data.keywords.filter((k) => k.keywordId !== null).map((k) => k.keywordId),
      db,
    ),
  ]);

  if (!categoryOk) errors.categoryId = 'Unknown category';

  const kindOfKeyword = new Map(foundKeywords.map((k) => [k.id, k.kindId]));
  data.keywords.forEach((k, index) => {
    if (!kindIds.includes(k.kindId)) errors[`keywords[${index}]`] = 'Unknown keyword kind';
    else if (k.keywordId !== null && kindOfKeyword.get(k.keywordId) !== k.kindId) {
      errors[`keywords[${index}]`] = 'Keyword does not belong to this keyword kind';
    }
  });

  const given = new Set(data.keywords.map((k) => k.kindId));
  const missing = kindIds.filter((id) => !given.has(id));
  if (missing.length > 0) errors.keywords = `Missing a value for keyword kinds: ${missing.join(', ')}`;

  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, 'Invalid post data', errors);
  }
}

// UC-004 / F-004: publish a lost or found post. Location, item and keywords are saved
// in one transaction, so invalid data or a failure never leaves a partial post (NF-005).
// Returns the author's view of the new post (public fields plus hiddenDetail).
async function createItem(userId, body) {
  const data = parseNewItem(body);

  const itemId = await withTransaction(async (client) => {
    await checkReferences(data, client);
    const locationId = await itemsRepository.insertLocation(client, data.location);
    const id = await itemsRepository.insert(client, { ...data, userId, locationId });
    await itemsRepository.replaceKeywords(client, id, data.keywords);
    return id;
  });

  return itemsRepository.findOwnById(itemId);
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
