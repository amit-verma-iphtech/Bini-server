const Joi = require('joi');

const notificationSchema = {
  sendPushNotification: Joi.object({
    userId: Joi.number().required(),
    title: Joi.string().required(),
    body: Joi.string(),
    subtitle: Joi.string(),
    sound: Joi.string(),
    navigate: Joi.string(),
  }),
};

module.exports = notificationSchema;
