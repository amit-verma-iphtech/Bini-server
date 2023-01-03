const catchAsync = require('../utils/catchAsync');
const { doorService, stripeService } = require('../services');
const { getAllParams } = require('../utils/helper');

const createStripeCustomer = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await stripeService.createStripeCustomer(data);
  res.send(response);
});
const chargeCustomer = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await stripeService.chargeCustomer(data);
  res.send(response);
});
const getChargeDetails = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await stripeService.getChargeDetails(data);
  res.send(response);
});
const createStripeCustomerWithCard = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await stripeService.createStripeCustomerWithCard(data);
  res.send(response);
});

module.exports = { createStripeCustomer, chargeCustomer, getChargeDetails, createStripeCustomerWithCard };
