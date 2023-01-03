const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { models } = require('../sequelize');
const ApiError = require('../utils/ApiError');

const createStore = async (data) => {
  const store = await models.store.create(data);
  return { data: store, message: 'Store Successfully created' };
};

const getStores = async (data) => {
  const { limit } = data;
  const stores = await models.store.findAll({
    ...(limit && { limit: limit * 1 }),
  });

  return { length: stores.length, data: stores };
};

const getStore = async (data) => {
  const { id } = data;
  const store = await models.store.findByPk(id);
  return store;
};

const updateStore = async (data) => {
  const { id } = data;
  const updateBody = { ...data };
  const store = await getStore({ id });
  if (!store) throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');

  Object.assign(store, updateBody);
  await store.save();
  return { data: store, message: 'Store updated successfully' };
};

const deleteStore = async (data) => {
  const { id } = data;
  const store = await getStore({ id });
  if (!store) throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');

  await models.store.destroy({ where: { id } });
  return { status: true, id, message: 'Store deleted successfully' };
};

module.exports = {
  createStore,
  getStore,
  getStores,
  updateStore,
  deleteStore,
};
