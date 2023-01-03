const express = require('express');
const { streamController } = require('../../controllers');

const router = express.Router();

// CRUD:
router.get('/', streamController.getStream);

module.exports = router;
