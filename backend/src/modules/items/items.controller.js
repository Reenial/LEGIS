// Lost/found posts. F-001, F-002, F-004 to F-007. UC-001, UC-002, UC-004 to UC-006.
// Controllers translate HTTP <-> service calls. Every handler is a stub for now.
const notImplemented = require('../../utils/notImplemented');

// GET /api/items
const listItems = notImplemented('UC-001', 'Browse/search/filter public posts (type, category, keywords, location, time)');

// GET /api/me/items
const listMyItems = notImplemented('UC-005', 'Signed-in user\'s own posts (entry point for edit, remove and matches)');

// GET /api/items/:itemId
const getItem = notImplemented('UC-002', 'Public post details (never hidden_detail)');

// POST /api/items
const createItem = notImplemented('UC-004', 'Publish a lost or found post with location and keywords');

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
