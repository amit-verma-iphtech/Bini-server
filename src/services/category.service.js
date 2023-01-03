const httpStatus = require('http-status');
const { Sequelize } = require('sequelize');
const { models } = require('../sequelize');
const ApiError = require('../utils/ApiError');

const createCategory = async (data) => {
  const category = await models.category.create(data);
  return category;
};
const getAllCategories = async (data) => {
  const { storeId } = data;
  const categories = await models.category.findAll({
    where: {
      ...(storeId && { storeId }),
    },
    limit: 2000,
  });
  return { length: categories.length, status: true, data: categories };
};
const getCategoryById = async (data) => {
  const { categoryId: id } = data;
  const category = await models.category.findByPk(id);

  return category;
};
const updateCategoryById = async (data) => {
  const { categoryId, ...updatedBody } = data;

  const category = await getCategoryById({ categoryId });
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  Object.assign(category, updatedBody);
  await category.save();
  return { status: true, message: 'Successfully updated category', category };
};

/**
 * Delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (data) => {
  const { categoryId } = data;
  const category = await getCategoryById({ categoryId });
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');

  await models.category.destroy({
    where: { id: categoryId },
  });
  return { status: true, message: `Successfully deleted category`, id: category.id };
};
module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
