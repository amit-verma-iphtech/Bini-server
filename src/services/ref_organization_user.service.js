const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { models } = require('../sequelize');
const ApiError = require('../utils/ApiError');

const createRef_organization_user = async (data) => {
  const ref_organization_user = await models.ref_organization_user.create(data);
  return { data: ref_organization_user, message: 'Ref_organization_user Successfully created' };
};
const ref_organization_userIncludes = [
  {
    attributes: ['name', 'id'],
    model: models.user,
    as: 'users',
  },
];
const getRef_organization_users = async (data) => {
  const { limit, storeId, userId } = data;
  const ref_organization_users = await models.organization.findAll({
    ...(limit && { limit: limit * 1 }),
    ...(userId && { userId }),
    include: ref_organization_userIncludes,
  });

  return { length: ref_organization_users.length, data: ref_organization_users };
};

const getRef_organization_user = async (data) => {
  const { id } = data;
  const ref_organization_user = await models.ref_organization_user.findByPk(id);
  return ref_organization_user;
};

const updateRef_organization_user = async (data) => {
  const { id } = data;
  const updateBody = { ...data };
  const ref_organization_user = await getRef_organization_user({ id });
  if (!ref_organization_user) throw new ApiError(httpStatus.NOT_FOUND, 'Ref_organization_user not found');

  Object.assign(ref_organization_user, updateBody);
  await ref_organization_user.save();
  return { data: ref_organization_user, message: 'Ref_organization_user updated successfully' };
};

const deleteRef_organization_user = async (data) => {
  const { id } = data;
  const ref_organization_user = await getRef_organization_user({ id });
  if (!ref_organization_user) throw new ApiError(httpStatus.NOT_FOUND, 'Ref_organization_user not found');

  await models.ref_organization_user.destroy({ where: { id } });
  return { status: true, id, message: 'Ref_organization_user deleted successfully' };
};

module.exports = {
  createRef_organization_user,
  getRef_organization_user,
  getRef_organization_users,
  updateRef_organization_user,
  deleteRef_organization_user,
};
