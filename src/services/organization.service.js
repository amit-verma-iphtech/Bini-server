const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { models } = require('../sequelize');
const ApiError = require('../utils/ApiError');
const services = require('./index');

const organizationIncludes = (props) => {
  const { userId, storeId } = props;
  const includes = [
    {
      model: models.user,
      as: 'users',
      attributes: ['name', 'id', 'email', 'avatar'],
      where: {
        ...(userId && { id: userId }),
      },
    },
    {
      model: models.store,
      as: 'stores',
      attributes: ['name', 'id'],
      where: {
        ...(storeId && { id: storeId }),
      },
    },
  ];
  return includes;
};
const createOrganization = async (organizationBody) => {
  const organization = await models.organization.create(organizationBody);
  return { data: organization, message: 'Organization Successfully created' };
};

const getOrganizations = async (data) => {
  const { limit, userId, storeId } = data;
  let user;
  if (userId) user = await services.userService.getUserById({ userId });
  const isAdmin = user.role === 'admin';

  const organizations = await models.organization.findAll({
    ...(limit && { limit: limit * 1 }),
    include: isAdmin
      ? organizationIncludes({ userId: undefined, storeId: undefined })
      : organizationIncludes({ userId: user.id, storeId }),
  });

  return { length: organizations.length, data: organizations };
};

const getOrganization = async (data) => {
  const { id } = data;
  const organization = await models.organization.findByPk(id, {
    include: organizationIncludes({ userId: undefined, storeId: undefined }),
  });
  return organization;
};

const updateOrganization = async (data) => {
  const { id } = data;
  const updateBody = { ...data };
  const organization = await getOrganization({ id });
  if (!organization) throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');

  Object.assign(organization, updateBody);
  await organization.save();
  return { data: organization, message: 'Organization updated successfully' };
};

const deleteOrganization = async (data) => {
  const { id } = data;
  const organization = await getOrganization({ id });
  if (!organization) throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');

  await models.organization.destroy({ where: { id } });
  return { status: true, id, message: 'Organization deleted successfully' };
};

module.exports = {
  createOrganization,
  getOrganization,
  getOrganizations,
  updateOrganization,
  deleteOrganization,
};
