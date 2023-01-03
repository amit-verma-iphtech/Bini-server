const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const tagController = require('../../controllers/tag.controller');

const router = express.Router();

// CRUD:
// todo

// Other:
router.get('/highest-priority/:keywords', tagController.getHighestPriorityTagByKeywordList);

module.exports = router;
