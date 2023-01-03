module.exports = (io) => {
  const welcome = async function (socket, namespace) {
    console.log('New Connection Received, Socket Id: ', socket.id);
    socket.emit('welcome', { message: 'Welcome, you are connected with socket', ...(namespace && { namespace }) });
  };
  const disconnected = async function (reason) {
    const socket = this;
    console.log(`Socket: ${socket.id} Left...`, reason);
  };

  return { welcome, disconnected };
};
