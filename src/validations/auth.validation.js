const Joi = require('joi');
const { password } = require('./custom.validation');

const authSchema = {
  register: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin', 'retailer', 'operator'),
    pushToken: Joi.string(),
  }),
  login: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    pushToken: Joi.string(),
  }),
  logout: Joi.object({
    refreshToken: Joi.string().required(),
  }),
  refreshTokens: Joi.object({
    refreshToken: Joi.string().required(),
  }),
  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required().custom(password),
  }),
};

module.exports = authSchema;
