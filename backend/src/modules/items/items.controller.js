// Lost/found posts. F-001, F-002, F-004 to F-007. UC-001, UC-002, UC-004 to UC-006.
// Controllers translate HTTP <-> service calls.
const notImplemented = require('../../utils/notImplemented');
const itemsService = require('./items.service');

// GET /api/items (UC-001). Public, no sign-in. Query parameters: see items.filters.js
// Express 5 forwards rejected promises to errorHandler, so no try/catch is needed.
async function listItems(req, res) {
  res.json(await itemsService.searchPublicItems(req.query));
}

// GET /api/me/items
const listMyItems = notImplemented('UC-005', 'Signed-in user\'s own posts (entry point for edit, remove and matches)');

// GET /api/items/:itemId
const getItem = notImplemented('UC-002', 'Public post details (never hidden_detail)');

// POST /api/items (UC-004). Signed-in users only (requireAuth). Body: see backend/API.md
async function createItem(req, res) {
  const item = await itemsService.createItem(req.session.user.id, req.body);
  res.status(201).json(item);
}

// PATCH /api/items/:itemId
const updateItem = notImplemented('UC-005', 'Author edits own post');

// DELETE /api/items/:itemId
const removeItem = notImplemented('UC-006', 'Author removes own post from public view (sets removed_at)');

// PATCH /api/items/:itemId/handed-over
const markHandedOver = notImplemented('UC-008', 'Author marks item as handed over (status = handed_over)');

module.exports = {
  listItems,
  listMyItems,
  getItem,
  createItem,
  updateItem,
  removeItem,
  markHandedOver,
};
