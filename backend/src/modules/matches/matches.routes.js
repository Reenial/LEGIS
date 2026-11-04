// Possible lost/found matches. F-012, UC-011. Keyword scoring via the item_match_scores view.
const { Router } = require('express');
const controller = require('./matches.controller');
const requireAuth = require('../../middleware/requireAuth');

const router = Router();

router.get('/items/:itemId/matches', requireAuth, controller.listMatches); // UC-011

module.exports = router;
