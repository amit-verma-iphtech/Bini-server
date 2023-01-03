/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
const jwt = require('jsonwebtoken');

const { firebaseAdmin } = require('../../../config/firebase');
const services = require('../../../services');
const { getUserRoom, getVisitRoom, getBasketRoom } = require('../../../utils/helper');

// const { verifyToken } = require("./token.service");

const connections = [];
const getIoMobile = () => {
  const { getIo } = require('../../../app');
  return getIo();
};

function getRoomClients(room) {
  const io = getIoMobile();

  return new Promise((resolve, reject) => {
    io.of('/')
      .in(room)
      .clients((error, clients) => {
        if (error) {
          return reject(error);
        }
        resolve(clients);
      });
  });
}
const convertBasketItemsList = (items) =>
  items.map((item) => {
    const {
      ref_basket_item,
      id,
      item: { imageUrl, name, description },
      price,
      discountedPrice,
      storeId,
      stock,
      active,
      categoryId,
    } = item;

    const convertedItem = {
      name,
      number: ref_basket_item.count,
      price,
      // id,
      // description,
      // discountedPrice,
      // storeId,
      // stock,
      // active,
      // categoryId,
      imageUrl,
    };
    return convertedItem;
  });

const convertVisitData = async ({ userId, socket }) => {
  let items = [];
  const visitIds = [];
  const basketIds = [];
  let activeBasketId;
  const visits = await services.visitService.getAllVisits({ userId });
  visits.data.map((object) => {
    const visitId = object.id;
    const visitRoom = getVisitRoom(visitId);
    socket && socket.join(visitRoom);

    visitIds.push(object.id);

    if (object.basket) {
      const basketId = object.basket.id;
      if (object.end === null) {
        activeBasketId = basketId;
      }
      const basketRoom = getBasketRoom(basketId);
      socket && socket.join(basketRoom);
      basketIds.push(object.id);

      items = [...items, ...object.basket.items];
    }
  });
  const convertedItemList = convertBasketItemsList(items);
  return { items: convertedItemList, visitIds, basketIds, activeBasketId };
};

const loginSocket = async ({ socket, userId }) => {
  const { items, ...props } = await convertVisitData({ userId });

  const connection = {
    socket,
    socketId: socket.id,
    ...props,
  };
  connections.push(connection);
  return { items, connection };
};

const joinRooms = ({ inside, join }) => {
  const io = getIoMobile();
  return io.in(inside).socketsJoin(join);
};
const joinAllRooms = ({ userId }) => {};

module.exports = {
  loginSocket,
  joinRooms,
  getIoMobile,
  convertVisitData,
  convertBasketItemsList,
};
