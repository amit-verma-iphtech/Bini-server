const Joi = require('joi');

const storeSchema = {
  createStore: Joi.object({
    name: Joi.string().required(),
    locationId: Joi.string().required(),
  }),
  getStores: Joi.object({
    organizationId: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    shouldNotIncludeStoreId: Joi.number(),
  }),

  getStore: Joi.object({
    id: Joi.number().required(),
  }),

  updateStore: Joi.object({
    id: Joi.number().integer(),
    name: Joi.string(),
    locationId: Joi.string(),
  }),
  deleteStore: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = storeSchema;
