const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const transactionValidation = require('../../validations/transaction.validation');
const transactionController = require('../../controllers/transaction.controller');

const router = express.Router();

// CRUD
router.get('/', validate(transactionValidation.register), transactionController.getTransactions);
router.get('/:transactionId', validate(transactionValidation.register), transactionController.getTransaction);
router.post('/', validate(transactionValidation.register), transactionController.createTransaction);
router.put('/:transactionId', validate(transactionValidation.register), transactionController.updateTransaction);

// Other
router.post('/checkout', validate(transactionValidation.register), transactionController.createCheckoutTransaction);
router.post('/webhook-payment-made', transactionController.webhookPaymentMade);

module.exports = router;
