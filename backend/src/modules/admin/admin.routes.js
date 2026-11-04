// Moderation for administrators. F-015, UC-014.
const { Router } = require('express');
const controller = require('./admin.controller');
const requireAdmin = require('../../middleware/requireAdmin');

const router = Router();

router.get('/admin/reports', requireAdmin, controller.listReports); // UC-014
router.patch('/admin/reports/:reportId', requireAdmin, controller.resolveReport); // UC-014

module.exports = router;
