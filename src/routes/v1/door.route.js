const express = require('express');
const doorController = require('../../controllers/door.controller');

const router = express.Router();

router.post('/unlock', doorController.unlockDoor);
router.post('/notify', doorController.notify);

module.exports = router;
