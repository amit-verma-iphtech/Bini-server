const config = require('../config/config');
// eslint-disable-next-line import/order
const stripe = require('stripe')(config.stripePrivateKey);
const { updateUserById } = require('./user.service');
// const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const createPaymentIntent = async () => {
  const customer = await stripe.customers.create({
    description: 'My First Test Customer (created for API docs)',
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'usd',
  });

  return paymentIntent;
};

const createStripeCustomer = async (data) => {
  const { email, cardToken, uid } = data;

  const customer = await stripe.customers.create({
    email, // optional
    // name: `${user.first_name} ${user.last_name}`, // optional
    metadata: {
      user_id: uid, // Or anything else
    },
    source: cardToken,
  });
  const updateUserPayload = {
    userId: uid,
    customerId: customer.id,
  };
  await updateUserById(updateUserPayload);
  return { customer };
};
const createStripeCustomerWithCard = async (data) => {
  const { email, number, exp_month, exp_year, cvc, uid } = data;

  const token = await stripe.tokens.create({
    card: {
      number,
      exp_month,
      exp_year,
      cvc,
    },
  });

  const customer = await stripe.customers.create({
    email, // optional
    // name: `${user.first_name} ${user.last_name}`, // optional
    metadata: {
      user_id: uid, // Or anything else
    },
    source: token.id,
  });

  const updateUserPayload = {
    userId: uid,
    customerId: customer.id,
  };
  await updateUserById(updateUserPayload);
  return { customer, token };
};

const createCheckoutSession = async (itemList, transactionUuid) => {
  // PAYMENT INTENT
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    payment_method_types: ['card'],
  });

  return paymentIntent.client_secret;
};
const chargeCustomer = async (data) => {
  const { customerId, amount } = data;
  const charge = await stripe.charges.create({
    amount: amount * 100,
    currency: 'eur',
    customer: customerId,
    description: 'My First Test Charge (created for API docs)',
  });
  return { charge };
};
const getChargeDetails = async (data) => {
  const { transactionId } = data;
  const charge = await stripe.charges.retrieve(transactionId);
  return { charge };
};

module.exports = {
  chargeCustomer,
  getChargeDetails,
  createCheckoutSession,
  createStripeCustomer,
  createPaymentIntent,
  createStripeCustomerWithCard,
};
