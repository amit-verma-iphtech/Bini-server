const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');
const { getAllParams } = require('../utils/helper');

const createCategory = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const category = await categoryService.createCategory(data);
  res.status(httpStatus.CREATED).send(category);
});
const getCategories = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const result = await categoryService.getAllCategories(data);
  res.send(result);
});

const getCategory = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const response = await categoryService.getCategoryById(data);
  if (!response) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  res.send(response);
});
const updateCategory = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const response = await categoryService.updateCategoryById(data);
  res.send(response);
});

const deleteCategory = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await categoryService.deleteCategoryById(data);
  res.send(response);
});

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  getCategory,
  deleteCategory,
};
