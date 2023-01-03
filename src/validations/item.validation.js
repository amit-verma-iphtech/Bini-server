const Joi = require('joi');

const itemSchema = {
  createItem: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    imageUrl: Joi.string().required(),
  }),
  getItems: Joi.object({
    storeId: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    shouldNotIncludeStoreId: Joi.number(),
    itemId: Joi.number(),
  }),
  getItem: Joi.object({
    id: Joi.number().required(),
  }),

  updateItem: Joi.object({
    id: Joi.number().integer(),
    name: Joi.string(),
    description: Joi.string(),
    imageUrl: Joi.string(),
  }),
  deleteItem: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = itemSchema;
