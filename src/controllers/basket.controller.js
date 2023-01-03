const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { basketService } = require('../services');
const { getAllParams } = require('../utils/helper');

const createBasket = catchAsync(async (req, res) => {
  const basket = await basketService.createBasket(req.body);
  res.status(httpStatus.CREATED).send(basket);
});

const getBaskets = catchAsync(async (req, res) => {
  const data = req.query;

  const result = await basketService.getAllBaskets(data);
  res.send(result);
});

const getPaidBaskets = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const result = await basketService.getPaidBaskets(data);
  res.send(result);
});

const getBasket = catchAsync(async (req, res) => {
  const basket = await basketService.getBasketById(req.params.basketId);
  if (!basket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Basket not found');
  }
  res.send(basket);
});

const updateBasket = catchAsync(async (req, res) => {
  const basket = await basketService.updateBasketById(req.params.basketId, req.body);
  res.send(basket);
});

const deleteBasket = catchAsync(async (req, res) => {
  await basketService.deleteBasketById(req.params.basketId);
  res.status(httpStatus.NO_CONTENT).send();
});
const addBasketItem = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await basketService.addBasketItem(data);
  res.send(result);
});
const getBasketItemById = catchAsync(async (req, res) => {
  const result = await basketService.getBasketItemById(req.params.basketItemId);
  res.send(result);
});
const removeBasketItem = catchAsync(async (req, res) => {
  const result = await basketService.removeBasketItem(req.params.basketItemId);
  res.send(result);
});

module.exports = {
  createBasket,
  getBaskets,
  getBasket,
  updateBasket,
  deleteBasket,
  addBasketItem,
  getBasketItemById,
  removeBasketItem,
  getPaidBaskets,
};
