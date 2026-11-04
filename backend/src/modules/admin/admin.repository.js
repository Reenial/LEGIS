// Database access for admin. SQL only, no business rules.
// Schema: database/schema.sql
// const pool = require('../../db/pool');

// TODO: SELECT from post_reports JOIN items
async function findReports(status) {
  throw new Error('Not implemented: adminRepository.findReports');
}

// TODO: UPDATE post_reports
async function updateReview(reportId, status, reviewerId) {
  throw new Error('Not implemented: adminRepository.updateReview');
}

module.exports = {
  findReports,
  updateReview,
};
