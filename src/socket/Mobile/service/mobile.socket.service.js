const jwt = require('jsonwebtoken');
const { SOCKET_MESSAGE, SOCKET_EMIT_TYPE } = require('../../../constants/socket.constants');
const { handleBasketSendUpdate } = require('../../../services/basket_item.service');
const { getUserRoom, getVisitRoom, getBasketRoom } = require('../../../utils/helper');
const { joinRooms, loginSocket, getIoMobile } = require('../helper/mobile.socket.helper');

module.exports = (io) => {
  const login = async function (data, cb) {
    const socket = this; // hence the 'function' above, as an arrow function will not work

    try {
      console.log('hittting login...');
      const {
        auth: { token },
      } = data;
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedData.sub;

      const {
        items,
        connection: { basketIds, visitIds, activeBasketId },
      } = await loginSocket({ socket, userId });
      const userRoom = getUserRoom(userId);

      socket.join(userRoom);
      console.log('Server_Ping onMobile... userRoom->', userRoom);
      getIoMobile()
        .to(userRoom)
        .emit('SERVER_PING', {
          data: { message: 'User Joined Room' },
        });
      await joinRooms({ inside: userRoom, join: basketIds });
      await joinRooms({ inside: userRoom, join: visitIds });

      console.log('basketIds.length, visitIds.length, userRoom, items.length');
      console.log(basketIds.length, visitIds.length, userRoom, items.length);

      handleBasketSendUpdate({ basketId: activeBasketId });
    } catch (error) {
      if (cb) cb({ error: error.message, status: false, message: 'Token Invalid' });
      console.log('Token Invalid');
    }
  };

  return {
    login,
  };
};
