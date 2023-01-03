const catchAsync = require('../utils/catchAsync');
const { doorService } = require('../services');
const { getAllParams } = require('../utils/helper');

const unlockDoor = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await doorService.unlockDoor(data);
  res.send(response);
});
const notify = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await doorService.notify(data);
  res.send(response);
});
const sendPushNotification = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await doorService.sendPushNotification(data);
  res.send(response);
});

module.exports = {
  unlockDoor,
  notify,
};
