const httpStatus = require('http-status');
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');
const { getAllParams } = require('../utils/helper');

const sendPushNotification = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const result = await notificationService.sendPushNotification(data);
  res.send(result);
});

module.exports = {
  sendPushNotification,
};
