const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const { getAllParams } = require('../utils/helper');
const { cameraService } = require('../services');

const getShelf = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await cameraService.getShelf(data);
  return res.send(response);
});
const getCameras = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await cameraService.getCameras(data);
  return res.send(response);
});
module.exports = {
  getShelf,
  getCameras,
};
