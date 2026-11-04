// Moderation for administrators. F-015, UC-014.
// Business rules and permission checks live here (NF-002), not in controllers.
// const HttpError = require('../../utils/HttpError');
// const adminRepository = require('./admin.repository');

// TODO: Return reports joined with item info
async function listReports(status) {
  throw new Error('Not implemented: admin.listReports');
}

// TODO: Set status, reviewed_by, reviewed_at; on remove also mark the item removed
async function resolveReport(adminId, reportId, action) {
  throw new Error('Not implemented: admin.resolveReport');
}

module.exports = {
  listReports,
  resolveReport,
};
