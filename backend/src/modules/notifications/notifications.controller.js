// In-app match notifications. F-013, UC-012.
// Controllers translate HTTP <-> service calls. Every handler is a stub for now.
const notImplemented = require('../../utils/notImplemented');

// GET /api/notifications
const listNotifications = notImplemented('UC-012', 'Current user\'s notifications');

// PATCH /api/notifications/:notificationId/read
const markRead = notImplemented('UC-012', 'Mark a notification as read');

// PUT /api/notifications/settings
const updateSettings = notImplemented('UC-012', 'Enable/disable match notifications ({ enabled })');

module.exports = {
  listNotifications,
  markRead,
  updateSettings,
};
