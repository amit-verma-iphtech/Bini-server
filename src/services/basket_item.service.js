/* eslint-disable no-nested-ternary */
const httpStatus = require('http-status');
const { basketService, visitService } = require('.');
const { slackChannels } = require('../config/config');

const { SOCKET_MESSAGE, SOCKET_EMIT_TYPE } = require('../constants/socket.constants');
const { models } = require('../sequelize');
const { getIoMobile, convertVisitData, convertBasketItemsList } = require('../socket/Mobile/helper/mobile.socket.helper');
const ApiError = require('../utils/ApiError');
const { getBasketRoom, getUserRoom, notifySlack } = require('../utils/helper');

/**
 * Create a basketItem
 * @param {Object} basketItemBody
 * @returns {Promise<BasketItem>}
 */
const handleBasketSendUpdate = async ({ basketId }) => {
  if (!basketId) {
    console.log('No basketId available...');
    return;
  }
  // getting userId....
  const basketDetails = await basketService.getBasketById(basketId);

  const visitDetails = await visitService.getVisitById(basketDetails.visitId);
  const { userId } = visitDetails;
  // getting userId....end
  const { items } = basketDetails;
  const convertedItems = convertBasketItemsList(items);
  const userRoom = getUserRoom(userId);
  const io = getIoMobile();
  io.to(userRoom).emit(SOCKET_MESSAGE, {
    type: SOCKET_EMIT_TYPE.UPDATE_BASKET,
    data: { basket: convertedItems, length: items.length },
  });
};

const createBasketItem = async (data) => {
  const { basketId, itemId } = data;
  if (!basketId || !itemId) throw new ApiError(httpStatus.BAD_GATEWAY, 'basketId & itemId required');
  const item = await models.ref_item_store.findOne({
    where: { id: itemId },
    include: [{ model: models.item, as: 'item' }],
    raw: true,
  });
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, `No Item with id : ${itemId}`);
  const itemName = item['item.name'];

  const basket = await models.basket.findOne({
    where: { id: data.basketId },
    include: [{ model: models.visit, include: [{ model: models.user }] }],
    raw: true,
  });
  if (!basket) throw new ApiError(httpStatus.NOT_FOUND, `No Basket with id: ${basketId}`);
  let userName = basket['visit.user.name'];
  const storeId = basket['visit.storeId'];
  if (userName === null) userName = `storeCustomerId ${basket['visit.storeCustomerId']}`;
  if (userName === null || !userName) userName = 'Anonymous user';
  let basketItem = await models.ref_basket_item.findOne({
    where: {
      itemId,
      basketId: data.basketId,
    },
  });

  if (!basketItem) {
    if (data.remove >= 1) {
      throw new ApiError(httpStatus.NOT_FOUND, `${itemName} is not in your basket`);
    }
    basketItem = await models.ref_basket_item.create({
      basketId: data.basketId,
      itemId,
      count: 0,
    });
  }
  let slackMessage;

  if (data.add) {
    basketItem.count += data.add;
    slackMessage = `${userName} added ${data.add} ${itemName} in his basket`;
  } else if (data.remove) {
    basketItem.count -= data.remove;
    slackMessage = `${userName} removed ${data.remove} ${itemName} from his basket`;
  } else {
    basketItem.count += 1;
    slackMessage = `${userName} added 1 ${itemName} in his basket`;
  }
  console.log(`



basketItem.count ${basketItem.count}


`);

  if (!(basketItem.count >= 1)) {
    await basketItem.destroy({
      where: { id: basketItem.id },
    });
    slackMessage = `${userName} removed ${itemName} from his basket`;
    const message = `${itemName} removed from basket`;
    await notifySlack({ text: slackMessage, storeId, isAlert: true })
      .then((res) => console.log('Notification sent to edeka channel'))
      .catch((err) => console.error('Notification not sent to edeka channel'));
    handleBasketSendUpdate({ basketId });
    return { message, data: { id: basketItem.id } };
  }

  await basketItem.save();

  const message = data.add
    ? `${data.add} ${itemName} added in basket`
    : data.remove
    ? `${data.remove} ${itemName} removed from basket`
    : `1 ${itemName} added in the basket`;

  handleBasketSendUpdate({ basketId });

  await notifySlack({
    url: slackChannels.common,
    text: slackMessage || `${userName} preformed some action in his basket for item ${itemName}`,
    storeId,
  })
    .then((res) => console.log('Notification sent to edeka channel'))
    .catch((err) => console.error('Notification not sent to edeka channel'));
  return {
    message,
    data: basketItem,
  };
};

/**
 * Query for basketItems
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getAllBasketItems = async () => {
  const basketItems = await models.ref_basket_item.findAll({
    limit: 2000,
  });

  return basketItems;
};

/**
 * Query for basketItems
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
/**
 * Get basketItem by id
 * @param {ObjectId} id
 * @returns {Promise<BasketItem>}
 */
const getBasketItemById = async (id) => {
  // let getModel = basket();

  const basket = await models.ref_basket_item.findByPk(id);

  return basket;
};

/**
 * Update basketItem by id
 * @param {ObjectId} basketItemId
 * @param {Object} updateBody
 * @returns {Promise<BasketItem>}
 */

/**
 * Delete basketItem by id
 * @param {ObjectId} basketItemId
 * @returns {Promise<BasketItem>}
 */
const deleteBasketItemById = async (basketItemId) => {
  const basketItem = await getBasketItemById(basketItemId);
  if (!basketItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Basket not found');
  }
  await models.ref_basket_item.destroy({
    where: {
      itemId: basketItemId,
    },
  });
  return { id: basketItem.id };
};

module.exports = {
  createBasketItem,
  getBasketItemById,
  getAllBasketItems,
  deleteBasketItemById,
  handleBasketSendUpdate,
};
