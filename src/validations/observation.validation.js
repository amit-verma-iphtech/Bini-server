const Joi = require('joi');

const observation = {
  verifyMultiple: Joi.object({
    observationIds: Joi.array().required(),
    userId: Joi.number().required(),
    storeId: Joi.number().required(),
  }),
  unVerifyMultiple: Joi.object({
    observationIds: Joi.array().required(),
    userId: Joi.number().required(),
  }),
  updateMany: Joi.object({
    storeId: Joi.number(),
    userId: Joi.number().required(),
    action: Joi.string().valid('VERIFY', 'UNVERIFY', 'FREE').required(),
  }),
  getAssignedObservations: Joi.object({
    storeId: Joi.number(),
    userId: Joi.number().required(),
    verified: Joi.boolean(),
  }),
};

module.exports = observation;
