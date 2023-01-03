const httpStatus = require('http-status');
const { default: Stripe } = require('stripe');
const ffmpeg = require('ffmpeg');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { chatbotService, visionService } = require('../services');
const { stripeService } = require('../services');
const { imageService } = require('../services');

const ping = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send('pong');
});

const getChatbotStates = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send(chatbotService.getStates());
});

const callback = () => {};

const tests = catchAsync(async (req, res) => {
  imageService.createImage({
    url: 'test',
    itemId: 1,
  });

  res.status(httpStatus.OK).send('OK');
});

module.exports = {
  ping,
  tests,
  getChatbotStates,
};
