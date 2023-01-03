const express = require('express');
const { stripeController } = require('../../controllers');
const doorController = require('../../controllers/door.controller');

const validate = require('../../middlewares/validate');
const { paramSchema } = require('../../validations');

const router = express.Router();

router.post('/create-customer', validate(paramSchema.stripe.createStripeCustomer), stripeController.createStripeCustomer);
router.post(
  '/create-customer-with-card',
  validate(paramSchema.stripe.createStripeCustomerWithCard),
  stripeController.createStripeCustomerWithCard
);
router.post('/charge', validate(paramSchema.stripe.chargeCustomer), stripeController.chargeCustomer);
router.post('/charge-details', validate(paramSchema.stripe.getChargeDetails), stripeController.getChargeDetails);

module.exports = router;
