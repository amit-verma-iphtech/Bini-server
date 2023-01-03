const { DISCONNECT } = require('./constants/index.socket.constant');
const mobileSocket = require('./Mobile');
const opsDashboardSocket = require('./OpsDashboard');

module.exports = (io) => {
  // socketServer....
  const { welcome, disconnected } = require('./helper/index.socket')(io);
  const onConnection = (socket) => {
    console.log('socket connected....onMobile', socket.id);
    welcome(socket, 'MOBILE');
    mobileSocket(io, socket);
  };

  // const mobileIo = io.of('/');
  // console.log('socket connected....onMobile');
  // mobileIo.on('connection', (socket) => {
  //   welcome(socket, 'MOBILE');
  //   mobileSocket(mobileIo, socket);
  //   socket.on(DISCONNECT, disconnected);
  // });

  const opsDashboardIo = io.of('/ops-dashboard');
  opsDashboardIo.on('connection', (socket) => {
    console.log('socket connected....onOPS_dashboard', socket.id);
    welcome(socket, 'OPS_DASHBOARD');
    opsDashboardSocket(opsDashboardIo, socket);
    socket.on(DISCONNECT, disconnected);
  });

  io.on('connection', onConnection);
};
