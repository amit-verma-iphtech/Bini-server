const httpStatus = require('http-status');
const { models } = require('../sequelize');
const ApiError = require('../utils/ApiError');

const getHighestPriorityTagByKeywordList = async (keywords) => {
  const resultTag = await models.tag.findAll({
    limit: 100,
    where: {
      text: keywords,
    },
    order: [['priority', 'DESC']],
  });

  return resultTag[0];
};

module.exports = {
  getHighestPriorityTagByKeywordList,
};
