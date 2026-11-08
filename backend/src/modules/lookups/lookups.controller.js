// Reference data for forms and filters: categories, keyword kinds and keywords. F-001, F-004.
// Controllers translate HTTP <-> service calls.
// Express 5 forwards rejected promises to errorHandler, so no try/catch is needed.
const lookupsService = require('./lookups.service');

// GET /api/categories (UC-001). Public.
async function listCategories(req, res) {
  res.json(await lookupsService.getCategories());
}

// GET /api/keywords (UC-001). Public.
async function listKeywords(req, res) {
  res.json(await lookupsService.getKeywordsGroupedByKind());
}

module.exports = {
  listCategories,
  listKeywords,
};
