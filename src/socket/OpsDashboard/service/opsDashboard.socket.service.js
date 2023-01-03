const opsDashboardConstants = require('../constants/opsDashboard.socket.constant');

module.exports = (io) => {
  const loadObservations = async function (payload, cb) {
    return { status: true };
  };
  const loadActions = async function (payload, cb) {
    return { status: true };
  };
  const checkIdle = async function (payload, cb) {
    return { status: true };
  };
  const reAssignObservations = async function (payload, cb) {
    return { status: true };
  };
  const ping = async function (payload, cb) {
    const socket = this;
    console.log('OPS_DASHBOARD, ping: payload=>', payload);
    cb({ status: true, message: 'Successfully received ping' });
    socket.emit(opsDashboardConstants.PONG, { status: true, message: 'PONG' });
  };

  return {
    loadObservations,
    loadActions,
    checkIdle,
    reAssignObservations,
    ping,
  };
};
