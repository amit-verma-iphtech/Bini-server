const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ItemService } = require('../services');
const { getAllParams } = require('../utils/helper');

const createItem = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const item = await ItemService.createItem(data);
  res.status(httpStatus.CREATED).send(item);
});

const getItems = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const result = await ItemService.getItems(data);
  res.send(result);
});

const getItem = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const result = await ItemService.getItem(data);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');

  res.send(result);
});

const updateItem = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const item = await ItemService.updateItem(data);
  res.send(item);
});

const deleteItem = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const result = await ItemService.deleteItem(data);
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
};
