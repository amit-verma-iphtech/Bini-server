const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { tagService } = require('../services');

const getHighestPriorityTagByKeywordList = catchAsync(async (req, res) => {
  const keywords = req.params.keywords.split(',');
  console.log(`get high prio tag with keywords: ${keywords}`);

  const tag = await tagService.getHighestPriorityTagByKeywordList(keywords);
  console.log(`found tag: ${tag}`);
  res.status(httpStatus.OK).send(tag);
});

module.exports = {
  getHighestPriorityTagByKeywordList,
};
