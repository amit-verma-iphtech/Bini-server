const Joi = require('joi');

const categorySchema = {
  getAllCategory: Joi.object({
    storeId: Joi.number(),
  }),
  createCategory: Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    imageUrl: Joi.string(),
    storeId: Joi.number().required(),
  }),
  getCategories: Joi.object({
    categoryId: Joi.number(),
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
  getCategory: Joi.object({
    categoryId: Joi.number().required(),
  }),
  updateCategory: Joi.object({
    categoryId: Joi.number().required(),
    name: Joi.string(),
    description: Joi.string(),
    imageUrl: Joi.string(),
  }),
  deleteCategory: Joi.object({
    categoryId: Joi.number().required(),
  }),
};

module.exports = categorySchema;
