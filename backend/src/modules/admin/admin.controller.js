// Moderation for administrators. F-015, UC-014.
// Controllers translate HTTP <-> service calls. Every handler is a stub for now.
const notImplemented = require('../../utils/notImplemented');

// GET /api/admin/reports
const listReports = notImplemented('UC-014', 'Reports with their posts (?status=pending)');

// PATCH /api/admin/reports/:reportId
const resolveReport = notImplemented('UC-014', 'Dismiss the report or remove the post ({ action: dismiss|remove })');

module.exports = {
  listReports,
  resolveReport,
};
