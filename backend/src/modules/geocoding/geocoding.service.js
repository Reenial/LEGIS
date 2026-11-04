// Address to coordinates through Nominatim, called from the backend (doc 4.2). F-005.
// Business rules and permission checks live here (NF-002), not in controllers.
// const HttpError = require('../../utils/HttpError');

// TODO: Call Nominatim with NOMINATIM_USER_AGENT, respect its 1 request/second policy
async function searchAddress(query) {
  throw new Error('Not implemented: geocoding.searchAddress');
}

module.exports = {
  searchAddress,
};
