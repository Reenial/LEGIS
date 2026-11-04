// Reporting problematic posts. F-014, UC-013. Signed-in users only (C-06).
// Controllers translate HTTP <-> service calls. Every handler is a stub for now.
const notImplemented = require('../../utils/notImplemented');

// POST /api/items/:itemId/reports
const reportItem = notImplemented('UC-013', 'Report a post with a reason');

module.exports = {
  reportItem,
};
