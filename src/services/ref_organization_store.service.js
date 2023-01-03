const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { models } = require('../sequelize');
const ApiError = require('../utils/ApiError');

const createRef_organization_store = async (data) => {
  const ref_organization_store = await models.ref_organization_store.create(data);
  return { data: ref_organization_store, message: 'Ref_organization_store Successfully created' };
};

const getRef_organization_stores = async (data) => {
  const { limit, storeId, ref_organization_storeId } = data;
  const ref_organization_stores = await models.ref_organization_store.findAll({
    ...(limit && { limit: limit * 1 }),
    include: [],
  });

  return { length: ref_organization_stores.length, data: ref_organization_stores };
};

const getRef_organization_store = async (data) => {
  const { id } = data;
  const ref_organization_store = await models.ref_organization_store.findByPk(id);
  return ref_organization_store;
};

const updateRef_organization_store = async (data) => {
  const { id } = data;
  const updateBody = { ...data };
  const ref_organization_store = await getRef_organization_store({ id });
  if (!ref_organization_store) throw new ApiError(httpStatus.NOT_FOUND, 'Ref_organization_store not found');

  Object.assign(ref_organization_store, updateBody);
  await ref_organization_store.save();
  return { data: ref_organization_store, message: 'Ref_organization_store updated successfully' };
};

const deleteRef_organization_store = async (data) => {
  const { id } = data;
  const ref_organization_store = await getRef_organization_store({ id });
  if (!ref_organization_store) throw new ApiError(httpStatus.NOT_FOUND, 'Ref_organization_store not found');

  await models.ref_organization_store.destroy({ where: { id } });
  return { status: true, id, message: 'Ref_organization_store deleted successfully' };
};

module.exports = {
  createRef_organization_store,
  getRef_organization_store,
  getRef_organization_stores,
  updateRef_organization_store,
  deleteRef_organization_store,
};
