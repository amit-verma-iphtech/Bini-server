const Joi = require('joi');

const ref_organization_userSchema = {
  createRef_organization_user: Joi.object({
    invitedBy: Joi.number().required(),
    userId: Joi.number().required(),
    organizationId: Joi.number().required(),
    active: Joi.string(),
    accessType: Joi.string().required().valid('viewer', 'editor', 'admin'),
  }),
  getRef_organization_users: Joi.object({
    userId: Joi.number(),
    organizationId: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
  getRef_organization_user: Joi.object({
    id: Joi.number().required(),
  }),

  updateRef_organization_user: Joi.object({
    id: Joi.number().integer().required(),
    invitedBy: Joi.number(),
    userId: Joi.number(),
    organizationId: Joi.number(),
    active: Joi.string(),
    accessType: Joi.string().valid('viewer', 'editor', 'admin'),
  }),

  deleteRef_organization_user: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = ref_organization_userSchema;
