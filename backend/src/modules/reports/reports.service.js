// Reporting problematic posts. F-014, UC-013. Signed-in users only (C-06).
// Business rules and permission checks live here (NF-002), not in controllers.
// const HttpError = require('../../utils/HttpError');
// const reportsRepository = require('./reports.repository');

// TODO: Require a reason and an available post; does not remove the post
async function reportItem(userId, itemId, reason) {
  throw new Error('Not implemented: reports.reportItem');
}

module.exports = {
  reportItem,
};
