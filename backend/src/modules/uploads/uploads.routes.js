// Photo upload for posts (items.image_url). Storage provider not decided yet.
const { Router } = require('express');
const controller = require('./uploads.controller');
const requireAuth = require('../../middleware/requireAuth');

const router = Router();

router.post('/uploads/photo', requireAuth, controller.uploadPhoto); // UC-004

module.exports = router;
