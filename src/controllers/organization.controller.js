const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { organizationService } = require('../services');
const { getAllParams } = require('../utils/helper');

const createOrganization = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const organization = await organizationService.createOrganization(data);
  res.status(httpStatus.CREATED).send(organization);
});

const getOrganizations = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const result = await organizationService.getOrganizations(data);
  res.send(result);
});

const getOrganization = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const result = await organizationService.getOrganization(data);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');

  res.send(result);
});

const updateOrganization = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const organization = await organizationService.updateOrganization(data);
  res.send(organization);
});

const deleteOrganization = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const result = await organizationService.deleteOrganization(data);
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  createOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
};
