const sequelize = require('.');
const {
  tagsData,
  storesData,
  locationsData,
  camerasData,
  categoriesData,
  itemsData,
  usersData,
  observationsData,
  ref_item_storeData,
} = require('./data');

const createTags = async (tag) => {
  await tag.bulkCreate(tagsData);
};
const createLocations = async (tag) => {
  await tag.bulkCreate(locationsData);
};
const createStores = async (store) => {
  await store.bulkCreate(storesData());
};
const createCameras = async (camera) => {
  await camera.bulkCreate(camerasData);
};
const createCategories = async (category) => {
  await category.bulkCreate(categoriesData());
};
const createItems = async (item, ref_item_store) => {
  // string length checker...
  // itemsData.map(({ name }) => {
  //   const length = 500;
  //   if (name.length > length) {
  //     console.log('name.length-->', name.length);
  //   }
  // });

  const storeItems = await ref_item_storeData({ storeIdRange: 3 });
  await item
    .bulkCreate(itemsData)
    .then(() => console.log('items---created', storeItems.length))
    .then(async () => {
      // storeItems.map((props) => console.log('props', props));
      await ref_item_store.bulkCreate(storeItems, { ignoreDuplicates: true }).catch((err) => {
        // console.error(err);
        console.error(err.message);
      });
    })
    .then(() => console.log('ref_item_store---created'))
    .catch((err) => {
      // console.error(err);
      console.error(err.message);
    });
};
const createUsers = async () => {
  const { userService, tokenService } = require('../services');
  usersData.map(async (userD, idx) => {
    await userService
      .createUser(userD)
      .then(async (user0) => {
        const token = await tokenService.generateAuthTokens(user0);
        return { token, user: user0 };
      })
      .then(({ user }) => console.log(user.id))
      .catch((err) => console.error(err.message));
  });
};
const createObservations = async (observation) => {
  const obData = await observationsData(100);
  await observation.bulkCreate(obData);
};

module.exports = {
  createLocations,
  createStores,
  createCameras,
  createTags,
  createCategories,
  createItems,
  createUsers,
  createObservations,
};
