const Joi = require('joi');
const { objectId } = require('./custom.validation');

const ref_item_storeSchema = {
  createStoreProduct: Joi.object({
    stock: Joi.number().required(),
    active: Joi.boolean().required(),
    price: Joi.number().required(),
    discountedPrice: Joi.number().required(),
    storeItemId: Joi.number().integer(), // storeItemId
    storeId: Joi.number().required(),

    categoryId: Joi.number(),
    itemId: Joi.number(),

    isNewCategory: Joi.boolean().required(),
    newCategoryName: Joi.string(),

    isNewItem: Joi.boolean().required(),
    name: Joi.string(),
    description: Joi.string(),
    imageUrl: Joi.string(),
  }),

  getStoreProducts: Joi.object({
    storeId: Joi.number().integer(),
    categoryId: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),

  getStoreProduct: Joi.object({
    id: Joi.number().required(),
  }),

  updateStoreProduct: Joi.object({
    id: Joi.number().required(),
    stock: Joi.number(),
    active: Joi.boolean(),
    price: Joi.number(),
    discountedPrice: Joi.number(),
    storeItemId: Joi.number().integer(), // storeItemId
    storeId: Joi.number(),
    categoryId: Joi.number(),
    itemId: Joi.number(),

    isNewCategory: Joi.boolean().required(),
    newCategoryName: Joi.string(),

    isNewItem: Joi.boolean().required(),
    name: Joi.string(),
    description: Joi.string(),
    imageUrl: Joi.string(),
  }),

  deleteStoreProduct: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = ref_item_storeSchema;
