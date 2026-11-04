// Reporting problematic posts. F-014, UC-013. Signed-in users only (C-06).
const { Router } = require('express');
const controller = require('./reports.controller');
const requireAuth = require('../../middleware/requireAuth');

const router = Router();

router.post('/items/:itemId/reports', requireAuth, controller.reportItem); // UC-013

module.exports = router;
