// Return requests (claims table). F-008 to F-010. UC-007 to UC-009.
const { Router } = require('express');
const controller = require('./claims.controller');
const requireAuth = require('../../middleware/requireAuth');

const router = Router();

router.post('/items/:itemId/claims', requireAuth, controller.submitClaim); // UC-007
router.get('/claims', requireAuth, controller.listMyClaims); // UC-009
router.get('/claims/:claimId', requireAuth, controller.getClaim); // UC-008
router.patch('/claims/:claimId/decision', requireAuth, controller.decideClaim); // UC-008
router.patch('/claims/:claimId/withdraw', requireAuth, controller.withdrawClaim); // UC-009

module.exports = router;
