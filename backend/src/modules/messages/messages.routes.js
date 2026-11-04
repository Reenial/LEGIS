// Private messages between requester and post author, scoped to a claim. F-011, UC-010.
const { Router } = require('express');
const controller = require('./messages.controller');
const requireAuth = require('../../middleware/requireAuth');

const router = Router();

router.get('/claims/:claimId/messages', requireAuth, controller.listMessages); // UC-010
router.post('/claims/:claimId/messages', requireAuth, controller.sendMessage); // UC-010

module.exports = router;
