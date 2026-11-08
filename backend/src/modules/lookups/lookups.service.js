// Reference data for forms and filters: categories, keyword kinds and keywords. F-001, F-004.
// Business rules and permission checks live here (NF-002), not in controllers.
const lookupsRepository = require('./lookups.repository');

async function getCategories() {
  return lookupsRepository.findAllCategories();
}

async function getKeywordsGroupedByKind() {
  return lookupsRepository.findAllKeywords();
}

module.exports = {
  getCategories,
  getKeywordsGroupedByKind,
};
