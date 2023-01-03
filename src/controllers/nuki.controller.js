const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { NukiService } = require('../services');

const unlock = catchAsync(async (req, res) => {
  const result = await NukiService.unlock(req.body);
  res.send(result);
});

module.exports = {
  unlock,
};
