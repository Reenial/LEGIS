// Address to coordinates through Nominatim, called from the backend (doc 4.2). F-005.
// Signed-in users only: only the post form needs it, and Nominatim allows 1 request/second
// for the whole app, so anonymous traffic must not use up that limit.
const { Router } = require('express');
const controller = require('./geocoding.controller');
const requireAuth = require('../../middleware/requireAuth');

const router = Router();

router.get('/geocode', requireAuth, controller.searchAddress); // UC-004, UC-005
router.get('/geocode/reverse', requireAuth, controller.reverseGeocode); // UC-004, UC-005

module.exports = router;
