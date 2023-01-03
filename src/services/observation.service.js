const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { RESPONSE_SUCCESS } = require('../constants/responseMessages');
const sequelize = require('../sequelize');
const { models } = require('../sequelize');
const ApiError = require('../utils/ApiError');

/**
 * Create a observation
 * @param {Object} observationBody
 * @returns {Promise<Observation>}
 */
const createObservation = async (observationBody) => {
  // if (await Observation.isEmailTaken(observationBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }

  const observationPromise = models.observation.create(observationBody);

  return observationPromise;
};
const multipleUnVerify = async (data) => {
  const { observationIds, userId } = data;
  // const observationPromise = models.observation.create(observationBody);
  const { count: currentAssignedObservations } = await models.observation.findAndCountAll({
    where: { id: { [Op.in]: observationIds }, available: false, assignedTo: userId, verified: true },
  });
  const effected = await models.observation.update(
    { verified: false },
    {
      where: { id: { [Op.in]: observationIds }, available: false, assignedTo: userId, verified: true },
    }
  );
  return {
    status: RESPONSE_SUCCESS,
    message: 'Multiple Observations UnVerified',
    observationsMatchingInArray: currentAssignedObservations,
    effected,
  };
};
const multipleVerify = async (data) => {
  const { observationIds, userId, storeId } = data;
  // const observationPromise = models.observation.create(observationBody);
  const { count: currentSelectedObservations } = await models.observation.findAndCountAll({
    where: { id: { [Op.in]: observationIds }, available: false, assignedTo: userId, verified: false },
  });
  // getting currently assigned unverified observations....
  const { count: currentAssignedObservations } = await models.observation.findAndCountAll({
    where: { storeId, available: false, assignedTo: userId, verified: false },
  });
  // updating and counting effected observations..(effected is count)
  const [effected, ...updated] = await models.observation.update(
    { verified: true },
    {
      where: { id: { [Op.in]: observationIds }, available: false, assignedTo: userId, verified: false },
    }
  );
  const requiredNewObservations = effected; // number of observation we just verified...
  const skip = currentAssignedObservations - requiredNewObservations;
  if (requiredNewObservations > 0) {
    await models.observation.update(
      { available: false, assignedTo: userId },
      {
        limit: requiredNewObservations * 1,
        where: { storeId, available: true, assignedTo: null, verified: false },
      }
    );
  }

  const observations = await models.observation.findAll({
    offset: skip,
    where: {
      storeId,
      available: false,
      assignedTo: userId,
      verified: false,
    },
  });
  return {
    status: RESPONSE_SUCCESS,
    message: 'Multiple Observations Verified',
    observationsMatchingInArray: currentSelectedObservations,
    effected,
    data: observations,
    length: observations.length,
  };
};
const updateMany = async (data) => {
  const { userId, action, storeId } = data;

  let effected;
  if (action === 'VERIFY') {
    effected = await models.observation.update(
      { verified: true, available: false },
      {
        where: { assignedTo: userId, verified: false, ...(storeId && { storeId }) },
      }
    );
  } else if (action === 'UNVERIFY') {
    effected = await models.observation.update(
      { verified: false, available: false },
      {
        where: { assignedTo: userId, verified: true, ...(storeId && { storeId }) },
      }
    );
  } else if (action === 'FREE') {
    effected = await models.observation.update(
      { verified: false, available: true, assignedTo: null },
      {
        where: { assignedTo: userId, ...(storeId && { storeId }) },
      }
    );
  }
  return {
    status: RESPONSE_SUCCESS,
    message: 'Multiple Observations Effected',
    effected,
  };
};

/**
 * Query for observation
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getObservations = async (data) => {
  const { storeId, userId, limit } = data;
  if (!limit) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'limit is required');
  }
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'userId is required');
  }
  if (!storeId) {
    const allObservations = await models.observation.findAll({ limit: limit * 1 });
    return { length: allObservations.length, data: allObservations };
  }

  // getting currently assigned unverified observations....
  const { count: currentAssignedObservations } = await models.observation.findAndCountAll({
    where: { storeId, available: false, assignedTo: userId, verified: false },
  });
  const { count: currentAvailableObservations } = await models.observation.findAndCountAll({
    where: { storeId, available: true, assignedTo: null, verified: false },
  });
  let effectedObservation; // these are the new observation that get assigned in this operation
  if (currentAssignedObservations < limit) {
    effectedObservation = await models.observation.update(
      { available: false, assignedTo: userId },
      {
        limit: limit - currentAssignedObservations,
        where: { storeId, available: true, assignedTo: null, verified: false },
      }
    );
  }
  const { count: currentAvailableObservations_after_effectedObservations } = await models.observation.findAndCountAll({
    where: { storeId, available: true, assignedTo: null, verified: false },
  });
  // Getting Old Assigned Observation where were from other storeId which left unverified...

  const oldData = await models.observation.findAndCountAll({
    where: { storeId: { [Op.ne]: storeId }, available: false, assignedTo: userId, verified: false },
  });

  // Marking available .... All Unverified Observations from Other store
  const oldEffected = await models.observation.update(
    { available: true, assignedTo: null },
    {
      where: { storeId: { [Op.ne]: storeId }, available: false, assignedTo: userId, verified: false },
    }
  );

  const observations = await models.observation.findAll({
    where: {
      storeId,
      available: false,
      assignedTo: userId,
      verified: false,
    },
  });

  return {
    length: observations.length,
    data: observations,
    observationsEffected: effectedObservation,

    oldData: {
      length: currentAssignedObservations,
      previousUnverifiedObservation: oldData,
      effected: oldEffected,
    },

    currentAvailableObservations_after_effectedObservations,
    currentAvailableObservations,
  };
};
const viewAllObservations = async (data) => {
  const { storeId, userId, limit } = data;
  if (!limit) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'limit is required');
  }
  if (!storeId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'storeId is required');
  }

  const observations = await models.observation.findAll({
    limit: limit * 1 || 100,
    where: {
      storeId,
    },
  });

  return {
    length: observations.length,
    data: observations,
  };
};
const getVerifiedObservations = async (data) => {
  const { storeId, userId } = data;

  const observations = await models.observation.findAll({
    where: { storeId, assignedTo: userId, verified: true },
    order: [['createdAt', 'ASC']],
  });

  return { length: observations.length, data: observations };
};

const getExtraObservations = async (data) => {
  const { storeId, userId } = data;
  let { limit, extra } = data;

  if (limit) {
    limit *= 1;
  } else limit = 10;

  if (extra) extra *= 1;

  const extraCount = extra || 1;

  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'userId is required');
  }
  if (!storeId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'storeId is required');
  }

  const { count: currentAssignedObservations } = await models.observation.findAndCountAll({
    where: { storeId, available: false, assignedTo: userId, verified: false },
  });
  if (limit + extraCount <= currentAssignedObservations) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already Have Enough Extra Observation');
  }
  await models.observation.update(
    { available: false, assignedTo: userId },
    {
      limit: extraCount,
      where: { storeId, available: true, assignedTo: null },
    }
  );

  const observations = await models.observation.findAll({
    offset: currentAssignedObservations,
    where: {
      storeId,
      available: false,
      assignedTo: userId,
      verified: false,
    },
  });

  return { length: observations.length, data: observations };
};
const freeUnverifiedObservations = async (data) => {
  const { storeId, userId } = data;
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'userId is required');
  }
  await models.observation.update(
    { available: true, assignedTo: null },
    {
      where: { ...(storeId && { storeId: { [Op.ne]: storeId } }), available: false, assignedTo: userId, verified: false },
    }
  );
  return { status: true, message: 'Observations Marked Free' };
};
const getAssignedObservations = async (data) => {
  const { storeId, userId, verified } = data;
  const observations = await models.observation.findAll({
    where: {
      ...(storeId && { storeId }),
      available: false,
      assignedTo: userId,
      ...(verified !== undefined && { verified }),
    },
  });
  return {
    length: observations.length,
    status: true,
    message: 'Received observations assigned to you',
    data: observations,
  };
};

/**
 * Query for observation
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllObservationsWithCategory = async () => {
  const categories = await models.category.findAll({
    limit: 2000,
  });

  const observation = await models.observation.findAll({
    limit: 2000,
    include: [
      {
        model: models.category,
        as: 'category',
      },
    ],
  });

  return observation;
};

/**
 * Get observation by id
 * @param {ObjectId} id
 * @returns {Promise<Observation>}
 */
const getObservationById = async (id) => {
  // let getModel = observation();

  const observation = await models.observation.findByPk(id);

  return observation;
};

// /**
//  * Get observation by email
//  * @param {string} email
//  * @returns {Promise<Observation>}
//  */
// const getObservationByEmail = async (email) => {
//   return Observation.findOne({ email });
// };

/**
 * Update observation by id
 * @param {ObjectId} observationId
 * @param {Object} updateBody
 * @returns {Promise<Observation>}
 */

const updateObservationById = async (observationId, updateBody) => {
  const observation = await getObservationById(observationId);
  if (!observation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Observation not found');
  }

  Object.assign(observation, updateBody);
  await observation.save();

  return observation;
};

/**
 * Delete observation by id
 * @param {ObjectId} observationId
 * @returns {Promise<Observation>}
 */
const deleteObservationById = async (observationId) => {
  const observation = await getObservationById(observationId);
  if (!observation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Observation not found');
  }
  await models.observation.destroy({
    where: {
      id: observationId,
    },
  });
  return { id: observation.id };
};

/**
 * Get observation that fit one tag
 */
const getObservationsFitKeyword = async (tag) => {
  const limit = 2000;

  const observation = await models.observation.findAll({
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
    order: [[models.tag, models.ref_observation_tag, 'strength', 'DESC']],
    limit,
  });

  return observation;
};

module.exports = {
  createObservation,
  getObservationById,
  getObservations,
  updateObservationById,
  deleteObservationById,
  getObservationsFitKeyword,
  getAllObservationsWithCategory,
  getExtraObservations,
  freeUnverifiedObservations,
  getVerifiedObservations,
  multipleVerify,
  multipleUnVerify,
  updateMany,
  getAssignedObservations,
  viewAllObservations,
};
