// In-app match notifications. F-013, UC-012.
const { Router } = require('express');
const controller = require('./notifications.controller');
const requireAuth = require('../../middleware/requireAuth');

const router = Router();

router.get('/notifications', requireAuth, controller.listNotifications); // UC-012
router.patch('/notifications/:notificationId/read', requireAuth, controller.markRead); // UC-012
router.put('/notifications/settings', requireAuth, controller.updateSettings); // UC-012

module.exports = router;
