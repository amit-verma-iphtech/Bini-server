const Joi = require('joi');
const { objectId } = require('./custom.validation');

const stripeSchema = {
  createStripeCustomer: Joi.object({
    uid: Joi.number().required(),
    email: Joi.string().required(),
    description: Joi.string(),
    cardToken: Joi.string().required(),
  }),
  createStripeCustomerWithCard: Joi.object({
    uid: Joi.number().required(),
    email: Joi.string().required(),
    description: Joi.string(),
    number: Joi.number().required(),
    exp_month: Joi.number().required(),
    exp_year: Joi.number().required(),
    cvc: Joi.number().required(),
  }),
  chargeCustomer: Joi.object({
    customerId: Joi.string().required(),
    amount: Joi.number().required(),
  }),
  getChargeDetails: Joi.object({
    transactionId: Joi.string().required(),
  }),
};

module.exports = stripeSchema;
