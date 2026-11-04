// Reference data for forms and filters: categories, keyword kinds and keywords. F-001, F-004.
const { Router } = require('express');
const controller = require('./lookups.controller');

const router = Router();

router.get('/categories', controller.listCategories); // UC-001
router.get('/keywords', controller.listKeywords); // UC-001

module.exports = router;
