const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { observationService } = require('../services');
const { getAllParams } = require('../utils/helper');

const createObservation = catchAsync(async (req, res) => {
  const observation = await observationService.createObservation(req.body);
  res.status(httpStatus.CREATED).send(observation);
});

const multipleVerify = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await observationService.multipleVerify(data);
  res.send(response);
});

const updateMany = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await observationService.updateMany(data);
  res.send(response);
});

const multipleUnVerify = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await observationService.multipleUnVerify(data);
  res.send(response);
});

const getObservations = catchAsync(async (req, res) => {
  const data = req.query;
  const response = await observationService.getObservations(data);
  res.send(response);
});
const viewAllObservations = catchAsync(async (req, res) => {
  const data = req.query;
  const response = await observationService.viewAllObservations(data);
  res.send(response);
});
const getAssignedObservations = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await observationService.getAssignedObservations(data);
  res.send(response);
});
const getVerifiedObservations = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const result = await observationService.getVerifiedObservations(data);
  res.send(result);
});

const getObservation = catchAsync(async (req, res) => {
  const observation = await observationService.getObservationById(req.params.observationId);
  if (!observation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Observation not found');
  }
  res.send(observation);
});

const updateObservation = catchAsync(async (req, res) => {
  const observation = await observationService.updateObservationById(req.params.observationId, req.body);
  res.send(observation);
});
const getExtraObservations = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await observationService.getExtraObservations(data);
  res.send(response);
});
const freeUnverifiedObservations = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await observationService.freeUnverifiedObservations(data);
  res.send(response);
});

const deleteObservation = catchAsync(async (req, res) => {
  await observationService.deleteObservationById(req.params.observationId);
  res.status(httpStatus.NO_CONTENT).send();
});
module.exports = {
  createObservation,
  getObservations,
  getObservation,
  updateObservation,
  deleteObservation,
  getExtraObservations,
  freeUnverifiedObservations,
  getVerifiedObservations,
  multipleUnVerify,
  multipleVerify,
  updateMany,
  getAssignedObservations,
  viewAllObservations,
};
