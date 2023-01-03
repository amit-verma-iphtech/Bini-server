const express = require('express');
const authController = require('../../controllers/auth.controller');

const validate = require('../../middlewares/validate');
const { paramSchema } = require('../../validations');

const router = express.Router();

router.post('/register', validate(paramSchema.auth.register), authController.register);
router.post('/login', validate(paramSchema.auth.login), authController.login);
router.post('/logout', validate(paramSchema.auth.logout), authController.logout);
router.post('/refresh-tokens', validate(paramSchema.auth.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(paramSchema.auth.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(paramSchema.auth.resetPassword), authController.resetPassword);
router.get('/decode-token', authController.decodeToken);

module.exports = router;
