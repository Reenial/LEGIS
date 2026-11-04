// Reference data for forms and filters: categories, keyword kinds and keywords. F-001, F-004.
// Controllers translate HTTP <-> service calls. Every handler is a stub for now.
const notImplemented = require('../../utils/notImplemented');

// GET /api/categories
const listCategories = notImplemented('UC-001', 'List categories');

// GET /api/keywords
const listKeywords = notImplemented('UC-001', 'List keyword kinds with their predefined keywords');

module.exports = {
  listCategories,
  listKeywords,
};
