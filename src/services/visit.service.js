const httpStatus = require('http-status');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

const { models } = require('../sequelize');
const { joinRooms, getIoMobile } = require('../socket/Mobile/helper/mobile.socket.helper');
const ApiError = require('../utils/ApiError');
const { getUserRoom, getVisitRoom, getVisitImagesList } = require('../utils/helper');
const { SOCKET_MESSAGE, SOCKET_EMIT_TYPE } = require('../constants/socket.constants');

/**
 * Create a visit
 * @param {Object} visitBody
 * @returns {Promise<Visit>}
 */

const createVisit = async (data) => {
  const { exitOtherStore } = data;
  let alreadyInStore;

  if (data.userId) {
    alreadyInStore = await models.visit.findOne({
      where: {
        userId: data.userId,
        end: null,
      },
    });
  }

  if (alreadyInStore) {
    // don't throw error if response asked from door api...
    if (data.noErrorThrow) return { id: alreadyInStore.id, alreadyExist: true };
    // don't exit from other store just tell that visit already in some other store
    if (!exitOtherStore) {
      throw new ApiError(
        httpStatus.CONFLICT,
        `User already into  storeId: ${alreadyInStore.storeId} & visitId: ${alreadyInStore.id} userId: ${alreadyInStore.userId}`
      );
    }
    // if exitOtherStore is true, exit visits from other store and then continue on creating new visit process
    try {
      await models.visit.update({ end: data.start }, { where: { userId: data.userId, end: null } });
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        ` User already into  storeId: ${alreadyInStore.storeId} & visitId: ${alreadyInStore.id} userId: ${alreadyInStore.userId},
          and we failed to exit him from there.`
      );
    }
  }

  const visitPromise = await models.visit.create(data, { isNewRecord: true });

  const visitRoom = getVisitRoom(visitPromise.id);
  const userRoom = getUserRoom(visitPromise.userId);

  joinRooms({ inside: userRoom, join: [visitRoom] });
  const io = getIoMobile();
  io.in(visitRoom).emit('visit', 'You visited in store');

  return visitPromise;
};
const saveAnonymous = async (data) => {
  const visitPromise = await models.visit.create(data, { isNewRecord: true });
  return visitPromise;
};
const saveVisitWithStoreCustomerId = async (data) => {
  const { exitOtherStore } = data;
  let alreadyInStore;

  if (data.storeCustomerId) {
    alreadyInStore = await models.visit.findOne({
      where: {
        storeCustomerId: data.storeCustomerId,
        end: null,
      },
    });
  }

  if (alreadyInStore) {
    // don't throw error if response asked from door api...
    if (data.noErrorThrow) return { id: alreadyInStore.id, alreadyExist: true };
    if (!exitOtherStore) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        ` User already into  storeId: ${alreadyInStore.storeId} & visitId: ${alreadyInStore.id} storeCustomerId: ${alreadyInStore.storeCustomerId},
        and we failed to exit him from there.`
      );
    }
    try {
      await models.visit.update({ end: new Date() }, { where: { storeCustomerId: data.storeCustomerId, end: null } });
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        ` User already into  storeId: ${alreadyInStore.storeId} & visitId: ${alreadyInStore.id} storeCustomerID: ${alreadyInStore.storeCustomerId},
          and we failed to exit him from there.`
      );
    }
  }

  const visitPromise = await models.visit.create(data, { isNewRecord: true });
  return visitPromise;
};

/**
 * Query for visits
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
const visitIncludes = [
  {
    model: models.user,
  },
  {
    model: models.basket,
    include: basketIncludes,
  },
  {
    model: models.ref_visit_image,
    attributes: ['image'],
  },
];
const basketIncludesForStoreCustomerId = [
  {
    // attributes: ['name', 'description', 'price', 'imageUrl', 'discountedPrice', 'active'],
    model: models.ref_item_store,
    as: 'items',
    attributes: ['storeItemId'],
  },
];
const visitIncludesForStoreCustomerId = [
  {
    model: models.basket,
    include: basketIncludesForStoreCustomerId,
    attributes: ['id'],
  },
];
const getAllVisits = async (data) => {
  const { observationId, userId } = data;
  let { storeId } = data;

  let observation;
  if (observationId) {
    observation = await models.observation.findByPk(observationId);
    if (!observation) throw new ApiError(httpStatus.NOT_FOUND, `No observation exist with for ${observationId}`);
    storeId = observation.storeId;
  }
  const visits = await models.visit.findAll({
    where: {
      ...(storeId && { storeId }),
      ...(userId && { userId }),
      ...(observationId && {
        [Op.or]: [
          {
            end: null,
            start: { [Op.lte]: observation.start },
          },
          {
            end: { [Op.gte]: observation.start },
            start: { [Op.lte]: observation.start },
          },
        ],
      }),
    },
    include: visitIncludes,
  });
  const modifyVisitAnonymous = visits.map((visit, idx) => {
    const modifiedVisit = visit.dataValues;
    if (visit.userId === null) {
      modifiedVisit.userId = `Anonymous-${idx}`;
      modifiedVisit.user = { id: `Anonymous-${idx}`, name: `Anonymous${idx}` };
    }
    return modifiedVisit;
  });
  return { length: modifyVisitAnonymous.length, observation, data: modifyVisitAnonymous };
};
const getActiveVisit = async (data) => {
  const alreadyInStore = await models.visit.findOne({
    userId: data.userId,
    end: {
      [Op.or]: [
        null,
        //  data.end
      ],
    },
  });

  return { visit: alreadyInStore };
};

/**
 * Query for visits
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllVisitsWithCategory = async () => {
  const categories = await models.category.findAll({
    limit: 2000,
  });

  const visits = await models.visit.findAll({
    limit: 2000,
    include: [
      {
        model: models.category,
        as: 'category',
      },
    ],
  });

  return visits;
};

/**
 * Get visit by id
 * @param {ObjectId} id
 * @returns {Promise<Visit>}
 */
const getVisitById = async (id) => {
  // let getModel = visit();

  const visit = await models.visit.findByPk(id, {
    include: visitIncludes,
  });

  return visit;
};
const getActiveVisitByStoreCustomerId = async (data) => {
  const { storeCustomerId } = data;
  // let getModel = visit();

  const visit = await models.visit.findOne({
    where: {
      storeCustomerId,
      end: null,
    },
    include: visitIncludesForStoreCustomerId,
    attributes: ['storeCustomerId'],
  });
  const basketItems = visit.basket.items.map((item) => {
    const data = {
      storeItemId: item.storeItemId,
      count: item.ref_basket_item.count,
    };
    return data;
  });
  const response = {
    storeCustomerId: visit.storeCustomerId,
    basket: basketItems,
  };
  return response;
};

/**
 * Update visit by id
 * @param {ObjectId} visitId
 * @param {Object} updateBody
 * @returns {Promise<Visit>}
 */

const updateVisitById = async (visitId, updateBody) => {
  const visit = await getVisitById(visitId);
  if (!visit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Visit not found');
  }
  if (visit.end === null && updateBody.end) {
    const visitRoom = getVisitRoom(visit.id);
    const userRoom = getUserRoom(visit.userId);

    joinRooms({ inside: userRoom, join: [visitRoom] });
    const io = getIoMobile();
    io.in(visitRoom).emit(SOCKET_MESSAGE, {
      type: SOCKET_EMIT_TYPE.SOCKET_CHECK_OUT,
      data: { status: true },
    });
    io.in(visitRoom).emit(SOCKET_MESSAGE, {
      type: SOCKET_EMIT_TYPE.UPDATE_BASKET,
      data: { basket: [], status: true, message: 'Payment Done' },
    });
  }
  Object.assign(visit, updateBody);
  await visit.save();

  return visit;
};
const updateVisitStoreCustomerId = async (storeCustomerId, updateBody) => {
  // console.log('storeCustomerId-->', storeCustomerId);
  const visit = await models.visit.findOne({
    where: {
      storeCustomerId,
      end: null,
    },
  });
  if (!visit) throw new ApiError(httpStatus.NOT_FOUND, 'No visit active for this user in stores');

  Object.assign(visit, updateBody);
  await visit.save();
  return visit;
};

/**
 * Delete visit by id
 * @param {ObjectId} visitId
 * @returns {Promise<Visit>}
 */
const deleteVisitById = async (visitId) => {
  const visit = await getVisitById(visitId);
  if (!visit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Visit not found');
  }
  await models.visit.destroy({
    where: {
      id: visitId,
    },
  });

  return { id: visit.id };
};

/**
 * Get visits that fit one tag
 */
const getVisitsFitKeyword = async (tag) => {
  const limit = 2000;

  const visits = await models.visit.findAll({
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
    order: [[models.tag, models.ref_visit_tag, 'strength', 'DESC']],
    limit,
  });

  return visits;
};
const getVisitImages = async (data) => {
  const { visitId } = data;
  if (!visitId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'VisitId Required');
  }
  const list = await getVisitImagesList(visitId);
  return { data: list, length: list.length };
};

module.exports = {
  createVisit,
  getVisitById,
  getAllVisits,
  updateVisitById,
  deleteVisitById,
  getVisitsFitKeyword,
  getAllVisitsWithCategory,
  getActiveVisit,
  getVisitImages,
  saveAnonymous,
  updateVisitStoreCustomerId,
  saveVisitWithStoreCustomerId,
  getActiveVisitByStoreCustomerId,
};
