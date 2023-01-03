const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const adminController = require('../../controllers/admin.controller');

const router = express.Router();

router.get('/ping', adminController.ping);
router.get('/chatbot-states', auth('getStatus'), adminController.getChatbotStates);
router.get('/tests', adminController.tests);

module.exports = router;
