const httpStatus = require('http-status');
const tokenService = require('./token.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { models } = require('../sequelize');
const userService = require('./user.service');
const { sendPushNotificationAPI } = require('../utils/helper');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */

const sendPushNotification = async (data) => {
  const { userId, title, subtitle, body, sound, navigate } = data;
  const user = await userService.getUserById({ userId });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const userPushTokens = await models.ref_push_token.findAll({
    where: {
      userId,
    },
  });
  console.log(userPushTokens);
  const usedTokens = [];
  const pushTokens = userPushTokens.map(({ token }) => {
    const findIndex = usedTokens.findIndex((value) => value === token);
    if (findIndex > -1) return token;
    // badge: 23
    // body: "estst"
    // hello: "test"
    // sound: "default"
    // subtitle: "cool"
    // title: "Test"
    // to: "ExponentPushToken[0gmJGfGtefQ7jPbZc0CIyJ]"
    sendPushNotificationAPI({
      data: {
        ...(navigate && { navigate }),
      },
      title,
      token,
      ...(subtitle && { subtitle }),
      ...(body && { body }),
      ...(sound && { sound }),
    });
    usedTokens.push(token);
    return token;
  });
  return {
    used: {
      length: usedTokens.length,
      tokens: usedTokens,
    },
    available: {
      length: pushTokens.length,
      tokens: pushTokens,
    },
  };
};

module.exports = {
  sendPushNotification,
};
