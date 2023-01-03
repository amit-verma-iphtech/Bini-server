const httpStatus = require('http-status');
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const { getAllParams, sendPushNotificationAPI } = require('../utils/helper');

const register = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  console.log('register-log', data);
  const user = await userService.createUser(data);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password, pushToken } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if (pushToken) {
    await tokenService.savePushToken({ token: pushToken, userId: user.id });
    await sendPushNotificationAPI({ title: 'Welcome to app!', token: pushToken });
  }
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  const verifyTxt = crypto.randomBytes(4).toString('hex');
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken, verifyTxt);
  res.status(httpStatus.OK).send({ resetPasswordToken, resetPasswordCode: verifyTxt });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.OK).send({ message: 'Passwort erfolgreich zurückgesetzt.' });
});
const decodeToken = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const user = await tokenService.decodeToken(data);
  res.json({ status: true, data: user });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  decodeToken,
};
