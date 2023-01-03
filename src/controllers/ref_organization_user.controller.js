const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ref_organization_userService } = require('../services');
const { getAllParams } = require('../utils/helper');

const createRef_organization_user = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const ref_organization_user = await ref_organization_userService.createRef_organization_user(data);
  res.status(httpStatus.CREATED).send(ref_organization_user);
});

const getRef_organization_users = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const result = await ref_organization_userService.getRef_organization_users(data);
  res.send(result);
});

const getRef_organization_user = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const result = await ref_organization_userService.getRef_organization_user(data);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Ref_organization_user not found');

  res.send(result);
});

const updateRef_organization_user = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const ref_organization_user = await ref_organization_userService.updateRef_organization_user(data);
  res.send(ref_organization_user);
});

const deleteRef_organization_user = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const result = await ref_organization_userService.deleteRef_organization_user(data);
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  createRef_organization_user,
  getRef_organization_users,
  getRef_organization_user,
  updateRef_organization_user,
  deleteRef_organization_user,
};
