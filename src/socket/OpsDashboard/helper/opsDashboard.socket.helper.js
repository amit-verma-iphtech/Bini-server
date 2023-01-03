const getIoOpsDashboard = () => {
  const { getIo } = require('../../../app');
  return getIo().of('/ops-dashboard');
};
module.exports = {
  getIoOpsDashboard,
};
