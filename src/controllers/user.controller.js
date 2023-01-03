const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { getAllParams } = require('../utils/helper');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const response = await userService.getAllUsers(filter, options);
  // const result = await userService.queryUsers(filter, options);
  res.send(response);
});

const getUser = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const response = await userService.getUserById(data);
  if (!response) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  res.send(response);
});
const getUserByEmail = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const response = await userService.getUserByEmail(data);
  if (!response) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  res.send(response);
});

const updateUser = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  if (data.email) {
    const user = await userService.getUserByEmail({ email: data.email });
    if (user) throw new ApiError(httpStatus.UNAUTHORIZED, 'User already exist with provided email');
  }

  const response = await userService.updateUserById(data);
  res.send(response);
});

const deleteUser = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await userService.deleteUserById(data);
  res.send(response);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserByEmail,
};
