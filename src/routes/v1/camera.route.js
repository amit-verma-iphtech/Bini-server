const express = require('express');
const { streamController, cameraController } = require('../../controllers');

const router = express.Router();

// CRUD:
router.get('/get-shelf', cameraController.getShelf);
router.get('/get-cameras', cameraController.getCameras);

module.exports = router;
