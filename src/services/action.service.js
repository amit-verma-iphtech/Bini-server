const httpStatus = require('http-status');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');
const { models } = require('../sequelize');
const ApiError = require('../utils/ApiError');

/**
 * Create a action
 * @param {Object} actionBody
 * @returns {Promise<Action>}
 */
const createAction = async (data) => {
  const { observationId, actionAt } = data;
  let observation;
  if (observationId && !actionAt) {
    observation = await models.observation.findByPk(observationId);
    if (!observation)
      throw new ApiError(httpStatus.NOT_FOUND, `No observation exist with for ${observationId}, Failed to write action`);
  }

  const action = await models.action.create({ ...data, actionAt: actionAt || observation.start });

  return { status: true, data: action };
};

/**
 * Query for actions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getAllActions = async (data) => {
  const { actionOn, actionBy, observationId } = data;
  let observation;

  if (observationId) {
    observation = await models.observation.findByPk(observationId);
    if (!observation) throw new ApiError(httpStatus.NOT_FOUND, `No observation exist with for ${observationId}`);
  }
  const actions = await models.action.findAll({
    where: {
      ...(actionOn && { actionOn }),
      ...(actionBy && { actionBy }),
      ...(observationId && {
        [Op.and]: [
          {
            actionAt: { [Op.lte]: observation.end },
          },
          {
            actionAt: { [Op.gte]: observation.start },
          },
        ],
      }),
    },
    include: [
      {
        model: models.observation,
      },
    ],
  });

  return { length: actions.length, data: actions };
};

// const getAllActions = async (data) => {
//   const { actionOn, actionBy, observationId } = data;
//   const actions = await models.action.findAll({
//     limit: 2000,
//     where: {
//       ...(actionOn && { actionOn }),
//       ...(actionBy && { actionBy }),
//       ...(observationId && { observationId }),
//     },
//     include: [
//       {
//         model: models.observation,
//       },
//     ],
//   });

//   return { length: actions.length, data: actions };
// };

/**
 * Query for actions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllActionsWithCategory = async () => {
  const categories = await models.category.findAll({
    limit: 2000,
  });

  const actions = await models.action.findAll({
    limit: 2000,
    include: [
      {
        model: models.category,
        as: 'category',
      },
    ],
  });

  return actions;
};

/**
 * Get action by id
 * @param {ObjectId} id
 * @returns {Promise<Action>}
 */
const getActionById = async (id) => {
  const action = await models.action.findByPk(id);

  return action;
};

/**
 * Update action by id
 * @param {ObjectId} actionId
 * @param {Object} updateBody
 * @returns {Promise<Action>}
 */

const updateActionById = async (actionId, updateBody) => {
  const action = await getActionById(actionId);
  if (!action) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Action not found');
  }

  Object.assign(action, updateBody);
  await action.save();

  return action;
};

/**
 * Delete action by id
 * @param {ObjectId} actionId
 * @returns {Promise<Action>}
 */
const deleteActionById = async (actionId) => {
  const action = await getActionById(actionId);
  if (!action) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Action not found');
  }
  await models.action.destroy({
    where: {
      id: actionId,
    },
  });
  return { id: action.id };
};

/**
 * Get actions that fit one tag
 */
const getActionsFitKeyword = async (tag) => {
  const limit = 2000;

  const actions = await models.action.findAll({
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
    order: [[models.tag, models.ref_action_tag, 'strength', 'DESC']],
    limit,
  });

  return actions;
};

module.exports = {
  createAction,
  getActionById,
  getAllActions,
  updateActionById,
  deleteActionById,
  getActionsFitKeyword,
  getAllActionsWithCategory,
};
