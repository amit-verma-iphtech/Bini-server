const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const authSchema = {
  createUser: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin', 'retailer', 'operator'),
  }),
  getUsers: Joi.object({
    userId: Joi.number(),
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
  getUser: Joi.object({
    userId: Joi.number(),
  }),
  updateUser: Joi.object({
    userId: Joi.number().required(),
    mobileNo: Joi.string(),
    avatar: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().custom(password),
    name: Joi.string(),
    role: Joi.string().required().valid('user', 'admin', 'retailer', 'operator'),
  }),
  deleteUser: Joi.object({
    // userId: Joi.string().custom(objectId),
    userId: Joi.number(),
  }),
};

module.exports = authSchema;
