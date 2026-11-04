// Sign-in with Google (OAuth 2.0) and server sessions. F-003, UC-003.
const { Router } = require('express');
const controller = require('./auth.controller');
const requireAuth = require('../../middleware/requireAuth');

const router = Router();

router.post('/auth/google', controller.signInWithGoogle); // UC-003
router.post('/auth/logout', requireAuth, controller.signOut); // UC-003
router.get('/auth/me', controller.getCurrentUser); // UC-003

module.exports = router;
