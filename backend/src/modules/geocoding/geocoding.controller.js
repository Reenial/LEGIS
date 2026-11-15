// Address to coordinates through Nominatim, called from the backend (doc 4.2). F-005.
// Controllers translate HTTP <-> service calls.
// Express 5 forwards rejected promises to errorHandler, so no try/catch is needed.
const geocodingService = require('./geocoding.service');

// GET /api/geocode?q=Unska 3, Zagreb  (UC-004, UC-005)
async function searchAddress(req, res) {
  res.json(await geocodingService.searchAddress(req.query.q));
}

// GET /api/geocode/reverse?lat=45.8011&lon=15.9709  (UC-004, UC-005)
async function reverseGeocode(req, res) {
  res.json(await geocodingService.reverse(req.query.lat, req.query.lon));
}

module.exports = {
  searchAddress,
  reverseGeocode,
};
