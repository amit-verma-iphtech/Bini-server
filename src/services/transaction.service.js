/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const httpStatus = require('http-status');
const axios = require('axios');
const userService = require('./user.service');
const { models } = require('../sequelize');
const ApiError = require('../utils/ApiError');
const itemService = require('./item.service');
const stripeService = require('./stripe.service');

/**
 * Create a transaction
 * @param {Object} transactionBody
 * @returns {Promise<Transaction>}
 */
const createTransaction = async (data) => {
  const transaction = await models.transaction.create(data);

  return transaction;
};

/**
 * Query for transactions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllTransactions = async () => {
  const transactions = await models.transaction.findAll({
    limit: 200,
  });

  return transactions;
};

/**
 * Get transaction by id
 * @param {ObjectId} id
 * @returns {Promise<Transaction>}
 */
const getTransactionById = async (id) => {
  // let getModel = transaction();

  const transaction = await models.transaction.findByPk(id);

  return transaction;
};

/**
 * Update transaction by id
 * @param {ObjectId} transactionId
 * @param {Object} updateBody
 * @returns {Promise<Transaction>}
 */

const updateTransactionById = async (transactionId, updateBody) => {
  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  Object.assign(transaction, updateBody);
  await transaction.save();

  return transaction;
};

/**
 * Delete transaction by id
 * @param {ObjectId} transactionId
 * @returns {Promise<Transaction>}
 */
const deleteTransactionById = async (transactionId) => {
  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  await transaction.destroy({
    where: {
      id: transactionId,
    },
  });
  return transaction;
};

// example incoming payload
const exampleCheckoutDto = {
  user: {
    mobileNo: '491752342342',
  },
  transaction: {
    // transaction object
  },
  cartItems: [
    {
      itemId: 2,
      quantity: 3,
    },
    // array
  ],
};

/**
 * createCheckout
 *
 */
const createCheckout = async (checkoutDto) => {
  // 1. seperate the elements in the Dto
  const { transaction } = checkoutDto;
  const { user } = checkoutDto;
  const { cartItems } = checkoutDto;

  // 2. save the user
  const savedUser = await userService.getUserByMobileNoOrCreate(user.mobileNo);

  // 3. attached transaction to user and save it
  transaction.userId = savedUser.id;
  const savedTransaction = await models.transaction.create(transaction);

  // 4. save all ref elements
  const ref_item_transactions = [];

  cartItems.forEach((cartItem) => {
    const ref_item_transaction = {};
    ref_item_transaction.quantity = cartItem.quantity;
    ref_item_transaction.itemId = cartItem.itemId;
    ref_item_transaction.transactionId = savedTransaction.id;

    ref_item_transactions.push(ref_item_transaction);
  });

  // 5. create product list for stripe service
  // this is not ideal currently, as it makes 1 query per item
  const stripeProducts = [];

  for (const cartItem of cartItems) {
    const stripeProduct = {};
    stripeProduct.item = await itemService.getItemById(cartItem.itemId);
    stripeProduct.quantity = cartItem.quantity;
    stripeProducts.push(stripeProduct);
  }

  const sessionToken = stripeService.createCheckoutSession(stripeProducts, savedTransaction.uuid);

  const refsReturns = await models.ref_item_transaction.bulkCreate(ref_item_transactions);

  return sessionToken;
};

const changeTransactionStatus = async (transactionUuid, newStatus) => {
  const transaction = await models.transaction.findOne({
    // Conditions that must be met
    where: { uuid: transactionUuid },
    // Value of other columns to be set if no such row found
    // defaults: { secondColumn: "EXAMPLE" },
  });

  const res1 = await axios.post(
    'https://api.telegram.org/bot1510896817:AAFq3ACES3BNEBMW-O7xt1U8fwkn1fjid8I/sendMessage?chat_id=-423768654&text=New event:'
  );

  Object.assign(transaction, { status: newStatus });

  const newTransaction = await transaction.save();

  // send Telegram message of transaction object

  const telegramMessage = `New payment made:\n\ntransactionUuid=${newTransaction.uuid}\n\ncreated at=${newTransaction.createdAt}\n\nshipping on=${newTransaction.shippingDateTime}\n\nshipping address=${newTransaction.shippingAddress}`;

  const res2 = await axios.post(
    `https://api.telegram.org/bot1510896817:AAFq3ACES3BNEBMW-O7xt1U8fwkn1fjid8I/sendMessage?chat_id=-423768654&text=${telegramMessage}`
  );

  return newTransaction;
};

module.exports = {
  createTransaction,
  getTransactionById,
  getAllTransactions,
  updateTransactionById,
  deleteTransactionById,
  createCheckout,
  changeTransactionStatus,
};
