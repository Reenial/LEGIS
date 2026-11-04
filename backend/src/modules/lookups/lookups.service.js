// Reference data for forms and filters: categories, keyword kinds and keywords. F-001, F-004.
// Business rules and permission checks live here (NF-002), not in controllers.
// const HttpError = require('../../utils/HttpError');
// const lookupsRepository = require('./lookups.repository');

// TODO: Return all categories
async function getCategories() {
  throw new Error('Not implemented: lookups.getCategories');
}

// TODO: Return keyword_kinds with nested keywords
async function getKeywordsGroupedByKind() {
  throw new Error('Not implemented: lookups.getKeywordsGroupedByKind');
}

module.exports = {
  getCategories,
  getKeywordsGroupedByKind,
};
