const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { actionService } = require('../services');

const createAction = catchAsync(async (req, res) => {
  const action = await actionService.createAction(req.body);
  res.status(httpStatus.CREATED).send(action);
});

const getActions = catchAsync(async (req, res) => {
  const data = req.query;

  const result = await actionService.getAllActions(data);
  res.send(result);
});

const getAction = catchAsync(async (req, res) => {
  const action = await actionService.getActionById(req.params.actionId);
  if (!action) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Action not found');
  }
  res.send(action);
});

const updateAction = catchAsync(async (req, res) => {
  const action = await actionService.updateActionById(req.params.actionId, req.body);
  res.send(action);
});

const deleteAction = catchAsync(async (req, res) => {
  await actionService.deleteActionById(req.params.actionId);
  res.status(httpStatus.NO_CONTENT).send();
});
module.exports = {
  createAction,
  getActions,
  getAction,
  updateAction,
  deleteAction,
};
