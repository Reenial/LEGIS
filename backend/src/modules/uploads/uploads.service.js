// Photo upload for posts (items.image_url). Storage provider not decided yet.
// Business rules and permission checks live here (NF-002), not in controllers.
// const HttpError = require('../../utils/HttpError');

// TODO: Choose storage first (local disk is wiped on Render redeploys)
async function storePhoto(file) {
  throw new Error('Not implemented: uploads.storePhoto');
}

module.exports = {
  storePhoto,
};
