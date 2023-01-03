const joi = require('joi');

const visitSchema = {
  createVisit: joi.object({
    storeId: joi.number().required(),
    start: joi.string().required(),
    exitOtherStore: joi.boolean(),
    end: joi.string(),
    userId: joi.number().required(),
  }),
  getVisit: joi.object({
    observationId: joi.number(),
    userId: joi.number(),
    storeId: joi.number(),
  }),
  getVisitImages: joi.object({
    visitId: joi.number(),
  }),
  getActiveVisitByStoreCustomerId: joi.object({
    storeCustomerId: joi.string(),
  }),
  saveAnonymous: joi.object({
    storeId: joi.number().required(),
    start: joi.string().required(),
  }),
};

module.exports = visitSchema;
