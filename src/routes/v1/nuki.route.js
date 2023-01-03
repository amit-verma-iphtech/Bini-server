const express = require('express');
const nukiController = require('../../controllers/nuki.controller');

const router = express.Router();

//CRUD:
router.post('/unlock', nukiController.unlock);

module.exports = router;
