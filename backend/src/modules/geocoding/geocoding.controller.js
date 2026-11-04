// Address to coordinates through Nominatim, called from the backend (doc 4.2). F-005.
// Controllers translate HTTP <-> service calls. Every handler is a stub for now.
const notImplemented = require('../../utils/notImplemented');

// GET /api/geocode
const searchAddress = notImplemented('UC-004', 'Proxy ?q= to Nominatim and return lat/lon candidates');

module.exports = {
  searchAddress,
};
