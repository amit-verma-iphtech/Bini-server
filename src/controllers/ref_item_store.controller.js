const httpStatus = require('http-status');

const catchAsync = require('../utils/catchAsync');
const { ref_item_storeService, ItemService, categoryService } = require('../services');
const { getAllParams } = require('../utils/helper');
const ApiError = require('../utils/ApiError');

const createStoreProduct = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const { isNewItem, isNewCategory } = data;
  if (isNewItem) {
    const newItemData = { name: data.name, description: data.description, imageUrl: data.imageUrl };
    console.log('newItem-->', newItemData);
    const createdItem = await ItemService.createItem(newItemData);
    data.itemId = createdItem.data.id;
  }
  if (isNewCategory) {
    const newCategoryData = { name: data.newCategoryName };
    console.log('newCategory-->', newCategoryData);
    const createdCategory = await categoryService.createCategory(newCategoryData);
    data.categoryId = createdCategory.id;
  }
  const productData = {
    itemId: data.itemId,
    price: data.price,
    stock: data.stock,
    categoryId: data.categoryId,
    discountedPrice: data.discountedPrice,
    active: data.active,
    storeId: data.storeId,
    storeItemId: data.storeItemId,
  };

  console.log('newProduct-->', productData);
  const item = await ref_item_storeService.createStoreProduct(productData);
  res.status(httpStatus.CREATED).send(item);
});

const getStoreProducts = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const result = await ref_item_storeService.getStoreProducts(data);
  res.send(result);
});

const updateStoreProduct = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const { isNewItem, isNewCategory } = data;
  if (isNewItem) {
    const newItemData = { name: data.name, description: data.description, imageUrl: data.imageUrl };
    console.log('newItem-->', newItemData);
    const createdItem = await ItemService.createItem(newItemData);
    data.itemId = createdItem.data.id;
  }
  if (isNewCategory) {
    const newCategoryData = { name: data.newCategoryName };
    console.log('newCategory-->', newCategoryData);
    const createdCategory = await categoryService.createCategory(newCategoryData);
    data.categoryId = createdCategory.id;
  }
  const productData = {
    id: data.id,
    itemId: data.itemId,
    price: data.price,
    stock: data.stock,
    categoryId: data.categoryId,
    discountedPrice: data.discountedPrice,
    active: data.active,
    storeId: data.storeId,
    storeItemId: data.storeItemId,
  };
  const result = await ref_item_storeService.updateStoreProduct(productData);
  res.send(result);
});

const getStoreProduct = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const result = await ref_item_storeService.getStoreProduct(data);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'StoreProduct not found');
  res.send(result);
});

const deleteStoreProduct = catchAsync(async (req, res) => {
  const data = getAllParams(req);

  const result = await ref_item_storeService.deleteStoreProduct(data);
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  createStoreProduct,
  getStoreProducts,
  updateStoreProduct,
  getStoreProduct,
  deleteStoreProduct,
};
