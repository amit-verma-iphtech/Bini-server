const opsDashboardConstants = require('./constants/opsDashboard.socket.constant');

module.exports = (io, socket) => {
  const { loadObservations, loadActions, checkIdle, reAssignObservations, ping } =
    require('./service/opsDashboard.socket.service')(io);
  socket.on(opsDashboardConstants.PING, ping);
  socket.on(opsDashboardConstants.LOAD_ACTIONS, loadActions);
  socket.on(opsDashboardConstants.LOAD_OBSERVATIONS, loadObservations);
  socket.on(opsDashboardConstants.RE_ASSIGN_OBSERVATIONS, reAssignObservations);
  socket.on(opsDashboardConstants.CHECK_IDLE, checkIdle);
};
