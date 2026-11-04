// Database access for notifications. SQL only, no business rules.
// Schema: database/schema.sql
// const pool = require('../../db/pool');

// TODO: SELECT from notifications
async function findByUser(userId) {
  throw new Error('Not implemented: notificationsRepository.findByUser');
}

// TODO: INSERT ... ON CONFLICT DO NOTHING
async function insertIgnoreDuplicate(notification) {
  throw new Error('Not implemented: notificationsRepository.insertIgnoreDuplicate');
}

// TODO: UPDATE notifications SET is_read
async function markRead(notificationId) {
  throw new Error('Not implemented: notificationsRepository.markRead');
}

module.exports = {
  findByUser,
  insertIgnoreDuplicate,
  markRead,
};
