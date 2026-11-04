// In-app match notifications. F-013, UC-012.
// Business rules and permission checks live here (NF-002), not in controllers.
// const HttpError = require('../../utils/HttpError');
// const notificationsRepository = require('./notifications.repository');

// TODO: Return notifications, newest first
async function listForUser(userId) {
  throw new Error('Not implemented: notifications.listForUser');
}

// TODO: Only the recipient
async function markRead(userId, notificationId) {
  throw new Error('Not implemented: notifications.markRead');
}

// TODO: Update users.match_notifications_enabled
async function setEnabled(userId, enabled) {
  throw new Error('Not implemented: notifications.setEnabled');
}

// TODO: After a new found post: notify owners of matching lost posts who enabled notifications
async function createForNewItem(item) {
  throw new Error('Not implemented: notifications.createForNewItem');
}

module.exports = {
  listForUser,
  markRead,
  setEnabled,
  createForNewItem,
};
