const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { models } = require('../sequelize');
const ApiError = require('../utils/ApiError');

const createItem = async (itemBody) => {
  const item = await models.item.create(itemBody);
  return { data: item, message: 'Item Successfully created' };
};

const getItems = async (data) => {
  const { limit, storeId, shouldNotIncludeStoreId, itemId } = data;
  const items = await models.item.findAll({
    ...(limit && { limit: limit * 1 }),
    include: [
      {
        model: models.ref_item_store,
        // where: { storeId },
        where: {
          ...(storeId && { storeId }),
          ...(shouldNotIncludeStoreId && { storeId: { [Op.ne]: shouldNotIncludeStoreId } }),
        },
        as: 'item_store',
        attributes: ['storeId', 'id'],
      },
    ],
  });
  let selectedItem;
  if (itemId && shouldNotIncludeStoreId) {
    selectedItem = await models.item.findOne({
      include: [
        {
          model: models.ref_item_store,
          where: {
            ...(itemId && { itemId }),
            ...(storeId && { storeId: shouldNotIncludeStoreId }),
          },
          as: 'item_store',
        },
      ],
    });
  }
  if (selectedItem) {
    items.push(selectedItem);
  }
  return { length: items.length, data: items };
};

const getItem = async (data) => {
  const { id } = data;
  const item = await models.item.findByPk(id);
  return item;
};

const updateItem = async (data) => {
  const { id } = data;
  const updateBody = { ...data };
  const item = await getItem({ id });
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');

  Object.assign(item, updateBody);
  await item.save();
  return { data: item, message: 'Item updated successfully' };
};

const deleteItem = async (data) => {
  const { id } = data;
  const item = await getItem({ id });
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');

  await models.item.destroy({ where: { id } });
  return { status: true, id, message: 'Item deleted successfully' };
};

/**
 * Get items that fit one tag
 */
const getItemsFitKeyword = async (tag) => {
  const limit = 2000;

  const items = await models.item.findAll({
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
    order: [[models.tag, models.ref_item_tag, 'strength', 'DESC']],
    limit,
  });

  return items;
};

module.exports = {
  createItem,
  getItem,
  getItems,
  updateItem,
  deleteItem,
  getItemsFitKeyword,
};
