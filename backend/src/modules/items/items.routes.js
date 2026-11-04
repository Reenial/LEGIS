// Lost/found posts. F-001, F-002, F-004 to F-007. UC-001, UC-002, UC-004 to UC-006.
const { Router } = require('express');
const controller = require('./items.controller');
const requireAuth = require('../../middleware/requireAuth');

const router = Router();

router.get('/items', controller.listItems); // UC-001
router.get('/me/items', requireAuth, controller.listMyItems); // UC-005
router.get('/items/:itemId', controller.getItem); // UC-002
router.post('/items', requireAuth, controller.createItem); // UC-004
router.patch('/items/:itemId', requireAuth, controller.updateItem); // UC-005
router.delete('/items/:itemId', requireAuth, controller.removeItem); // UC-006
router.patch('/items/:itemId/handed-over', requireAuth, controller.markHandedOver); // UC-008

module.exports = router;
