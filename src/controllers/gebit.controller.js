const catchAsync = require('../utils/catchAsync');
const { gebitService } = require('../services');
const { getAllParams } = require('../utils/helper');

const gebitCheckIn = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await gebitService.gebitCheckIn(data);
  res.send(response);
});
const gebitCheckOut = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await gebitService.gebitCheckOut(data);
  res.send(response);
});
const gebitCurrentCustomers = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await gebitService.gebitCurrentCustomers(data);
  res.send(response);
});
const createGebitVisit = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await gebitService.createGebitVisit(data);
  res.send(response);
});
const exitGebitVisit = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await gebitService.exitGebitVisit(data);
  res.send(response);
});

module.exports = {
  createGebitVisit,
  exitGebitVisit,
  gebitCheckIn,
  gebitCheckOut,
  gebitCurrentCustomers,
};
