const mobileConstants = require('./constants/mobile.socket.constant');

module.exports = (io, socket) => {
  const { login } = require('./service/mobile.socket.service')(io);
  socket.on(mobileConstants.LOGIN, login);
};
