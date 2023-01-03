const httpStatus = require('http-status');
const { Sequelize } = require('sequelize');
const { visitService, tokenService } = require('.');

const { SOCKET_MESSAGE, SOCKET_EMIT_TYPE } = require('../constants/socket.constants');

const { models } = require('../sequelize');
const { joinRooms, getIoMobile, convertBasketItemsList } = require('../socket/Mobile/helper/mobile.socket.helper');
const ApiError = require('../utils/ApiError');
const { getBasketRoom, getUserRoom, getVisitRoom } = require('../utils/helper');

/**
 * Create a basket
 * @param {Object} basketBody
 * @returns {Promise<Basket>}
 */
const createBasket = async (basketBody, visitData) => {
  const basketPromise = await models.basket.create({ ...basketBody, visitId: visitData.id }, { isNewRecord: true });

  const basketId = basketPromise.id;
  const { visitId } = basketPromise;

  const basketRoom = getBasketRoom(basketId);
  const visitRoom = getVisitRoom(visitId);
  // const visitRoom = visitService.getVisitById(visitId);

  joinRooms({ inside: visitRoom, join: [basketRoom] });
  const io = getIoMobile();

  io.in(basketRoom).emit('basket', 'You Joined Basket');
  io.in(visitRoom).emit('visit', `Your basket connect to ${visitRoom}`);
  io.in(visitRoom).emit('basket', `Your basket connect to ${visitRoom}`);

  io.in(basketRoom).emit(SOCKET_MESSAGE, {
    type: SOCKET_EMIT_TYPE.UPDATE_BASKET,
    data: { basket: [], message: 'Your basket created.', length: 0 },
  });

  return basketPromise;
};
const createAnonymousVisitBasket = async (basketBody, visitData) => {
  const basketPromise = await models.basket.create({ ...basketBody, visitId: visitData.id }, { isNewRecord: true });
  return basketPromise;
};

/**
 * Query for baskets
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const basketIncludes = [
  {
    // attributes: ['name', 'description', 'price', 'imageUrl', 'discountedPrice', 'active'],
    model: models.ref_item_store,
    as: 'items',
    include: [
      {
        model: models.item,
        as: 'item',
      },
      {
        attributes: ['name', 'description', 'id'],
        model: models.category,
        as: 'category',
      },
    ],
  },
];
const getAllBaskets = async () => {
  const baskets = await models.basket.findAll({
    limit: 2000,
    include: basketIncludes,
  });

  return baskets;
};
const getPaidBaskets = async (data) => {
  const { token, limit, page } = data;
  let { userId } = data;
  if (token) {
    const decodedData = await tokenService.decodeToken({ token });
    userId = decodedData.sub;
  }
  const historyVisits = await models.visit.findAll({
    limit: 2000,
    include: [
      {
        model: models.basket,
        include: basketIncludes,
        where: {
          isPaid: true,
        },
      },
    ],
    where: {
      ...(userId && { userId }),
    },
  });
  const promiseAllBasket = historyVisits.map(async (visit) => {
    const { basket } = visit;
    const convertedItems = await convertBasketItemsList(basket.items);

    return { ...basket.dataValues, items: convertedItems, visit: { end: visit.end, start: visit.start } };
  });
  const baskets = await Promise.all(promiseAllBasket);
  return { length: baskets.length, data: baskets };
};

/**
 * Query for baskets
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllBasketsWithCategory = async () => {
  const categories = await models.category.findAll({
    limit: 2000,
  });

  const baskets = await models.basket.findAll({
    limit: 2000,
    include: [
      {
        model: models.category,
        as: 'category',
      },
    ],
  });

  return baskets;
};

/**
 * Get basket by id
 * @param {ObjectId} id
 * @returns {Promise<Basket>}
 */
const getBasketById = async (id) => {
  // let getModel = basket();

  const basket = await models.basket.findByPk(id, {
    include: basketIncludes,
    plain: true,
  });
  return basket;
};
const getBasketByVisit = async (data) => {
  const { visitId } = data;
  const basket = await models.basket.findOne({
    where: {
      visitId,
    },
    include: basketIncludes,
    plain: true,
  });
  const items = basket.items
    .map((el) => el.get({ plain: true }))
    .map(({ item: { name, description, imageUrl }, ...props }) => ({
      ...props,
      name,
      description,
      imageUrl,
    }));
  const modifiedBasket = { isPaid: basket.isPaid, visitId: basket.visitId, items };
  return modifiedBasket;
};

/**
 * Update basket by id
 * @param {ObjectId} basketId
 * @param {Object} updateBody
 * @returns {Promise<Basket>}
 */

const updateBasketById = async (basketId, updateBody) => {
  const basket = await getBasketById(basketId);
  if (!basket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Basket not found');
  }

  Object.assign(basket, updateBody);
  await basket.save();

  return basket;
};
const markPaid = async (visitId) => {
  if (!visitId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'visitId requited to Mark basket Paid');
  }
  const unPaidBasket = await models.basket.findOne({
    where: {
      visitId,
      isPaid: false,
    },
    include: basketIncludes,
    plain: true,
  });
  // console.log('markPaid-->', visitId, unPaidBasket);

  const updatedBasket = updateBasketById(unPaidBasket.id, { isPaid: true });

  // console.log('markPaid:basket:-->', updatedBasket);
  return updatedBasket;
};

/**
 * Delete basket by id
 * @param {ObjectId} basketId
 * @returns {Promise<Basket>}
 */
const deleteBasketById = async (basketId) => {
  const basket = await getBasketById(basketId);
  if (!basket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Basket not found');
  }
  await models.basket.remove();
  return { id: basket.id };
};

/**
 * Get baskets that fit one tag
 */
const getBasketsFitKeyword = async (tag) => {
  const limit = 2000;

  const baskets = await models.basket.findAll({
    include: [
      {
        model: models.tag,
        as: 'tags',
        attributes: ['text', 'priority'],
        through: {
          attributes: ['strength'],
        },
        where: {
          text: tag,
        },
      },
    ],
    order: [[models.tag, models.ref_basket_tag, 'strength', 'DESC']],
    limit,
  });

  return baskets;
};

module.exports = {
  createBasket,
  getBasketById,
  getAllBaskets,
  updateBasketById,
  deleteBasketById,
  getBasketsFitKeyword,
  getAllBasketsWithCategory,
  getPaidBaskets,
  markPaid,
  createAnonymousVisitBasket,
};
