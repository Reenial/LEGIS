// Database access for lookups. SQL only, no business rules.
// Schema: database/schema.sql
// const pool = require('../../db/pool');

// TODO: SELECT from categories
async function findAllCategories() {
  throw new Error('Not implemented: lookupsRepository.findAllCategories');
}

// TODO: SELECT from keyword_kinds JOIN keywords
async function findAllKeywords() {
  throw new Error('Not implemented: lookupsRepository.findAllKeywords');
}

module.exports = {
  findAllCategories,
  findAllKeywords,
};
