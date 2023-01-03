const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { models } = require('../sequelize');
const ApiError = require('../utils/ApiError');

const createStoreProduct = async (data) => {
  const storeProductExist = await models.ref_item_store.findOne({
    where: {
      itemId: data.itemId,
      storeId: data.storeId,
    },
  });
  if (storeProductExist) throw new ApiError(httpStatus.CONFLICT, 'StoreProduct Already Exist');
  const storeProduct = await models.ref_item_store.create(data);
  return { data: storeProduct, message: 'StoreProduct Successfully created' };
};
const getStoreProducts = async (data) => {
  const { storeId, categoryId } = data;

  const itemStoreList = await models.ref_item_store.findAll({
    limit: 2000,
    where: {
      ...(storeId && { storeId }),
      ...(categoryId && { categoryId }),
    },
    include: [
      {
        attributes: ['name', 'description', 'id'],
        model: models.category,
        as: 'category',
      },
      {
        model: models.item,
        as: 'item',
      },
    ],
  });
  const items = itemStoreList.map(
    ({
      stock,
      active,
      price,
      discountedPrice,
      storeItemId,
      storeId,
      id,
      itemId,
      item: { name, description, imageUrl },
      category,
    }) => ({
      stock,
      name,
      description,
      itemId,
      imageUrl,
      active,
      price,
      discountedPrice,
      storeItemId,
      storeId,
      id,
      category,
    })
  );
  return { length: items.length, data: items };
};
const getStoreProduct = async (data) => {
  const { id } = data;
  const storeProduct = await models.ref_item_store.findByPk(id);
  return storeProduct;
};
const updateStoreProduct = async (data) => {
  const { id, storeItemId } = data;
  const updateBody = { ...data, storeItemId: storeItemId * 1 === 0 ? null : storeItemId };
  const storeProduct = await getStoreProduct({ id });
  if (!storeProduct) throw new ApiError(httpStatus.NOT_FOUND, 'Store Product not found');

  Object.assign(storeProduct, updateBody);
  await storeProduct.save();
  return { data: storeProduct, message: 'StoreProduct updated successfully' };
};

const deleteStoreProduct = async (data) => {
  const { id } = data;
  const storeProduct = await getStoreProduct({ id });
  if (!storeProduct) throw new ApiError(httpStatus.NOT_FOUND, 'StoreProduct not found');

  await models.ref_item_store.destroy({ where: { id } });
  return { status: true, id, message: 'StoreProduct deleted successfully' };
};

module.exports = {
  createStoreProduct,
  getStoreProducts,
  getStoreProduct,
  updateStoreProduct,
  deleteStoreProduct,
};
