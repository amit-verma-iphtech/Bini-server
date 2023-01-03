const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { models } = require('../sequelize');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  await models.token
    .destroy({ where: { userId } })
    .then(() => console.log('successfully destroyed old refresh_tokens'))
    .catch(() => console.log('failed to distroy old refresh_tokens'));

  const tokenDoc = await models.token.create({
    token,
    userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};
const savePushToken = async ({ token, userId }) => {
  const existPushToken = await models.ref_push_token.findOne({
    where: {
      token,
      userId,
    },
  });
  if (existPushToken) return existPushToken;
  const tokenDoc = await models.ref_push_token.create({
    token,
    userId,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  if (!payload) throw new Error('jwt invalid');

  const tokenDoc = await models.token.findOne({
    where: {
      token,
      type,
      userId: payload.sub,
      blacklisted: false,
    },
  });
  if (!tokenDoc) throw new Error('refresh_token not found in table');

  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};
const decodeToken = async (data) => {
  try {
    const { token } = data;
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedData.sub;
    return decodedData;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token');
  }
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  decodeToken,
  savePushToken,
};
