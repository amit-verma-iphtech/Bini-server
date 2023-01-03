const Joi = require('joi');

const organizationSchema = {
  createOrganization: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  }),
  getOrganizations: Joi.object({
    storeId: Joi.number(),
    userId: Joi.number().required(),
    organizationId: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
  getOrganization: Joi.object({
    id: Joi.number().required(),
  }),

  updateOrganization: Joi.object({
    id: Joi.number().integer(),
    name: Joi.string(),
    description: Joi.string(),
  }),
  deleteOrganization: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = organizationSchema;
