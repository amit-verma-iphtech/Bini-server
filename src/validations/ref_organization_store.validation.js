const Joi = require('joi');

const ref_organization_storeSchema = {
  createRef_organization_store: Joi.object({
    invitedBy: Joi.number().required(),
    active: Joi.boolean(),
    organizationId: Joi.number().required(),
    storeId: Joi.number().required(),
  }),
  getRef_organization_stores: Joi.object({
    storeId: Joi.number(),
    organizationId: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
  getRef_organization_store: Joi.object({
    id: Joi.number().required(),
  }),

  updateRef_organization_store: Joi.object({
    id: Joi.number().required(),
    invitedBy: Joi.number(),
    active: Joi.boolean(),
    organizationId: Joi.number(),
    storeId: Joi.number(),
  }),
  deleteRef_organization_store: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = ref_organization_storeSchema;
