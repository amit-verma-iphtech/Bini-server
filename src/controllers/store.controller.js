const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { storeService } = require('../services');
const { getAllParams } = require('../utils/helper');

const createStore = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const Store = await storeService.createStore(data);
  res.status(httpStatus.CREATED).send(Store);
});

const getStores = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const data = getAllParams(req);
  const result = await storeService.getStores(data);
  res.send(result);
});

const getStore = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const result = await storeService.getStore(data);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
  }
  res.send(result);
});

const updateStore = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const result = await storeService.updateStoreById(data);
  res.send(result);
});

const deleteStore = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  await storeService.deleteStoreById(data);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createStore,
  getStores,
  getStore,
  updateStore,
  deleteStore,
};
