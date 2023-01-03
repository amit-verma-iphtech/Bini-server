const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { basketItemService } = require('../services');

const createBasketItem = catchAsync(async (req, res) => {
  const basketItem = await basketItemService.createBasketItem(req.body);
  res.status(httpStatus.CREATED).send(basketItem);
});

const getBasketItems = catchAsync(async (req, res) => {
  const data = req.query;
  const result = await basketItemService.getAllBasketItems(data);
  res.send(result);
});

const getBasketItem = catchAsync(async (req, res) => {
  const basketItem = await basketItemService.getBasketItemById(req.params.basketItemId);
  if (!basketItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BasketItem not found');
  }
  res.send(basketItem);
});

const updateBasketItem = catchAsync(async (req, res) => {
  const basketItem = await basketItemService.updateBasketItemById(req.params.basketItemId, req.body);
  res.send(basketItem);
});

const deleteBasketItem = catchAsync(async (req, res) => {
  await basketItemService.deleteBasketItemById(req.params.basketItemId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBasketItem,
  getBasketItems,
  getBasketItem,
  updateBasketItem,
  deleteBasketItem,
};
