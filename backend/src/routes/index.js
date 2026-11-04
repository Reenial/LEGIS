// Mounts every module router under /api.
const { Router } = require('express');

const router = Router();

router.use(require('../modules/auth/auth.routes'));
router.use(require('../modules/items/items.routes'));
router.use(require('../modules/lookups/lookups.routes'));
router.use(require('../modules/geocoding/geocoding.routes'));
router.use(require('../modules/uploads/uploads.routes'));
router.use(require('../modules/claims/claims.routes'));
router.use(require('../modules/messages/messages.routes'));
router.use(require('../modules/matches/matches.routes'));
router.use(require('../modules/notifications/notifications.routes'));
router.use(require('../modules/reports/reports.routes'));
router.use(require('../modules/admin/admin.routes'));

module.exports = router;
