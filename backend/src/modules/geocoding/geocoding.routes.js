// Address to coordinates through Nominatim, called from the backend (doc 4.2). F-005.
const { Router } = require('express');
const controller = require('./geocoding.controller');

const router = Router();

router.get('/geocode', controller.searchAddress); // UC-004

module.exports = router;
