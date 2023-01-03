const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const chatbotController = require('../../controllers/chatbot.controller');

const router = express.Router();

router.post('/test-process-incoming-webhook', chatbotController.test_processText);
router.post('/wa-process-incoming-webhook', chatbotController.wa_processText);

module.exports = router;
