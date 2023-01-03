const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { transactionService } = require('../services');
const { getAllParams } = require('../utils/helper');

/**
 * Crud: Create
 */
const createTransaction = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const Transaction = await transactionService.createTransaction(data);
  res.status(httpStatus.CREATED).send(Transaction);
});

/**
 * Crud: Get all
 */
const getTransactions = catchAsync(async (req, res) => {
  const result = await transactionService.getAllTransactions();
  res.send(result);
});

/**
 * Crud: Get by id
 */
const getTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.getTransactionById(req.params.transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  res.send(transaction);
});

/**
 * Crud: Update
 */
const updateTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.updateTransactionById(req.params.transactionId, req.body);
  res.send(transaction);
});

/**
 * Crud: Delete
 */
const deleteTransaction = catchAsync(async (req, res) => {
  await transactionService.deleteTransactionById(req.params.transactionId);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Create simple Checkout
 */
const createCheckoutTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.createCheckout(req.body);
  res.send(transaction);
});

/**
 * Webhook: triggered  when a payment is done
 */

const webhookPaymentMade = catchAsync(async (req, res) => {
  const { transactionUuid } = req.body.data.object.metadata;
  const newStatus = 'paid';

  transactionService.changeTransactionStatus(transactionUuid, newStatus);

  res.status(httpStatus.OK).send();
});

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  createCheckoutTransaction,
  webhookPaymentMade,
};
