const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ref_organization_storeService } = require('../services');
const { getAllParams } = require('../utils/helper');

const createRef_organization_store = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const ref_organization_store = await ref_organization_storeService.createRef_organization_store(data);
  res.status(httpStatus.CREATED).send(ref_organization_store);
});

const getRef_organization_stores = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const result = await ref_organization_storeService.getRef_organization_stores(data);
  res.send(result);
});

const getRef_organization_store = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const result = await ref_organization_storeService.getRef_organization_store(data);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Ref_organization_store not found');

  res.send(result);
});

const updateRef_organization_store = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const ref_organization_store = await ref_organization_storeService.updateRef_organization_store(data);
  res.send(ref_organization_store);
});

const deleteRef_organization_store = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const result = await ref_organization_storeService.deleteRef_organization_store(data);
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  createRef_organization_store,
  getRef_organization_stores,
  getRef_organization_store,
  updateRef_organization_store,
  deleteRef_organization_store,
};
