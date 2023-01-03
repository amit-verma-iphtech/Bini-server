const express = require('express');
const notificationController = require('../../controllers/notification.controller');

const validate = require('../../middlewares/validate');
const { paramSchema } = require('../../validations');

const router = express.Router();

router.post(
  '/send-push',
  validate(paramSchema.notification.sendPushNotification),
  notificationController.sendPushNotification
);

module.exports = router;
