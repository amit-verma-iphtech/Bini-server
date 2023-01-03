const httpStatus = require('http-status');
const { Sequelize } = require('sequelize');
const { models } = require('../sequelize');
const ApiError = require('../utils/ApiError');

const createImage = async (imageBody) => {
  // if (await Image.isEmailTaken(imageBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }

  const image = await models.image.create(imageBody);

  return image;
};

module.exports = {
  createImage,
};
