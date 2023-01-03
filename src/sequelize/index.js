/* eslint-disable no-return-assign */
/* eslint-disable global-require */
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
// const {
//   createUsers,
//   createItems,
//   createCategories,
//   createTags,
//   createCameras,
//   createStores,
//   createLocations,
//   createObservations,
// } = require('./sequelize.helper');

const sequelize = new Sequelize(process.env.MYSQL_DB_NAME, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_URL,
  dialect: 'mysql',
  freezeTableName: true,
  logging: false,
  pool: {
    maxUses: 100,
    max: 100,
    min: 0,
    idle: 10 * 1000,
  },
});

/**
 * Uncomment below block ("sequelize.sync...") to sync with database at startup
 *
 */

/* sequelize.sync().then(function(){
  console.log('DB connection sucessful.');
}, function(err){
  console.log('DB connection failed !.');
  console.log(err);
});
*/

const modelDefiners = [
  require('../models/user.model'),
  require('../models/token.model'),
  require('../models/transaction.model'),
  require('../models/item.model'),
  require('../models/location.model'),
  require('../models/tag.model'),
  require('../models/image.model'),
  require('../models/category.model'),
  require('../models/store.model'),
  require('../models/role.model'),
  require('../models/basket.model'),
  require('../models/visit.model'),
  require('../models/observation.model'),
  require('../models/action.model'),
  require('../models/camera.model'),
  require('../models/compartment2d.model'),
  require('../models/connections/ref_basket_item.model'),
  require('../models/connections/ref_visit_image.model'),
  require('../models/connections/ref_item_store.model'),
  require('../models/connections/ref_push_token.model'),

  require('../models/organization.model'),
  require('../models/connections/ref_organization_store.model'),
  require('../models/connections/ref_organization_user.model'),
  // require('../models/connections/ref_item_transaction.model'),
  // require('../models/connections/ref_item_tag.model'),
  // require('../models/connections/ref_user_role.model'),
  // Add more models here...
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
const {
  transaction,
  user,
  item,
  tag,
  token,
  role,
  category,
  image,
  visit,
  store,
  basket,
  observation,
  action,
  camera,
  location,
  // ref_item_transaction,
  // ref_item_tag,
  // ref_user_role,
  ref_item_store,
  ref_push_token,
  ref_basket_item,
  ref_visit_image,
  compartments2d,

  ref_organization_store,
  ref_organization_user,
  organization,
} = sequelize.models;
// new relations...
store.hasMany(camera);
camera.belongsTo(store);

camera.hasMany(observation);
observation.belongsTo(camera);

user.hasMany(action, { foreignKey: 'actionBy', as: 'actionInfo' });
action.belongsTo(user, { foreignKey: 'actionBy', as: 'userInfo' });

visit.hasMany(action, { foreignKey: 'actionOn', constraints: false, scope: { actionOnType: 'visit' } });
action.belongsTo(visit, { foreignKey: 'actionOn', constraints: false });
basket.hasMany(action, { foreignKey: 'actionOn', constraints: false, scope: { actionOnType: 'basket' } });
action.belongsTo(basket, { foreignKey: 'actionOn', constraints: false });
item.hasMany(action, { foreignKey: 'actionOn', constraints: false, scope: { actionOnType: 'item' } });
action.belongsTo(item, { foreignKey: 'actionOn', constraints: false });

observation.hasMany(action);
action.belongsTo(observation);

store.hasMany(visit);
visit.belongsTo(store);

visit.hasMany(ref_visit_image);
ref_visit_image.belongsTo(visit);

observation.belongsTo(store);
store.hasMany(observation);
user.hasMany(visit);
visit.belongsTo(user);
visit.hasOne(basket);
basket.belongsTo(visit);

user.hasMany(observation, {
  foreignKey: 'assignedTo',
  as: 'observationInfo',
});
observation.belongsTo(user, {
  foreignKey: 'assignedTo',
  as: 'userInfo',
});

basket.belongsToMany(ref_item_store, {
  through: ref_basket_item,
  as: 'items',
  foreignKey: 'basketId',
});
ref_item_store.belongsToMany(basket, {
  as: 'baskets',
  through: ref_basket_item,
  foreignKey: 'itemId',
});
store.belongsToMany(organization, {
  as: 'organizations',
  through: ref_organization_store,
  foreignKey: 'storeId',
});
organization.belongsToMany(store, {
  as: 'stores',
  through: ref_organization_store,
  foreignKey: 'organizationId',
});
user.belongsToMany(organization, {
  as: 'organizations',
  through: ref_organization_user,
  foreignKey: 'userId',
});
organization.belongsToMany(user, {
  as: 'users',
  through: ref_organization_user,
  foreignKey: 'organizationId',
});

store.belongsToMany(item, {
  through: ref_item_store,
  foreignKey: 'storeId',
});
item.belongsToMany(store, {
  through: ref_item_store,
  foreignKey: 'itemId',
});

// new end...

user.hasMany(transaction);
transaction.belongsTo(user);

user.hasMany(token);
token.belongsTo(user);

ref_item_store.belongsTo(category, {
  foreignKey: 'categoryId',
  as: 'category',
});
ref_item_store.belongsTo(store, {
  foreignKey: 'storeId',
  as: 'item_store',
});
ref_item_store.belongsTo(item, {
  foreignKey: 'itemId',
  as: 'item',
});
store.hasMany(ref_item_store, {
  as: 'item_store',
});
store.hasMany(category);
category.belongsTo(store, {
  foreignKey: 'storeId',
});

category.hasMany(ref_item_store, {
  as: 'item',
});
item.hasMany(ref_item_store, {
  as: 'item_store',
});

image.belongsTo(item, {
  foreignKey: 'itemId',
  as: 'item',
});

transaction.belongsToMany(item, {
  through: 'ref_item_transaction',
  foreignKey: 'transactionId',
});
transaction.belongsTo(visit);
visit.hasOne(transaction);

item.belongsToMany(transaction, {
  through: 'ref_item_transaction',
  foreignKey: 'itemId',
});

item.belongsToMany(tag, {
  through: 'ref_item_tag',
  foreignKey: 'itemId',
});
tag.belongsToMany(item, {
  through: 'ref_item_tag',
  foreignKey: 'tagId',
});

user.belongsToMany(role, {
  through: 'ref_user_role',
  foreignKey: 'userId',
});

role.belongsToMany(user, {
  through: 'ref_user_role',
  foreignKey: 'roleId',
});

ref_push_token.belongsTo(user, {
  foreignKey: 'userId',
});
user.hasMany(ref_push_token, {});

user.addHook('beforeCreate', 'beforeCreateUser', async (user, options) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

const generateDataScript = async () => {
  try {
    console.log('insert-store--Start');
    // console.log('inserting location ');
    // await createLocations(location);
    // console.log('inserting store ');
    // await createStores(store);
    // console.log('inserting camera ');
    // await createCameras(camera);
    // console.log('inserting tag ');
    // await createTags(tag);
    // console.log('inserting category ');
    // await createCategories(category);
    // console.log('inserting item & ref_item_store ');
    // await createItems(item, ref_item_store);
    // console.log('inserted item & ref_item_store ');
    // console.log('inserting user ');
    // await createUsers(user);
    // console.log('inserting observation ');
    // await createObservations(observation);
  } catch (error) {
    console.error(error.message);
  }
};
const forceSync = () => {
  sequelize
    .query('SET FOREIGN_KEY_CHECKS = 0')
    .then(async () => {
      // await basket.drop();
      // await visit.drop();
      // await ref_basket_item.drop();
      // await action.drop();
      // await category.drop();
      // await item.drop();

      console.log('sequelize...start');
      await sequelize.sync({
        // force: true,
      });
    })
    .then(async () => {
      sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    })
    .then(async () => {
      console.log('done forceSync');
      // generateDataScript().then(() => console.log('successfully generated new data'));
    });
};
if (process.env.NODE_ENV === 'development') {
  console.log('development - forceSync');
  // forceSync();
}
const getVerifiedSnippetWithNoLog = async (params) => {
  console.time('total-time');
  console.log('get all Verified Observation...');
  const allVerified = await observation.findAll({
    where: {
      verified: true,
    },
  });
  console.log('received');
  console.log('verified Observation count', allVerified.length);

  let countObservationsHasLog = 0;
  let countObservationsNotHaveLog = 0;
  let failed = 0;
  const checkActionsLogAvailable = allVerified.map(async ({ id }) => {
    // const checkActionsLogAvailable = allVerified.slice(0, 1).map(async ({ id }) => {
    try {
      const response = await action.findOne({
        where: { actionOnType: 'observation', actionOn: id },
      });
      if (response.id) return (countObservationsHasLog += 1);
      return (countObservationsNotHaveLog += 1);
    } catch (error) {
      failed += 1;
      console.error(error);
    }
  });

  console.log('waiting to promise to resolve...');
  console.time('check-action-time');
  const checkDone = await Promise.all(checkActionsLogAvailable);
  console.timeEnd('check-action-time');
  console.log('check-Done');
  console.log('check-countObservationsHasLog--->', countObservationsHasLog);
  console.log('check-countObservationsNotHaveLog--->', countObservationsNotHaveLog);
  console.log('check-failed--->', failed);
  console.timeEnd('total-time');
};
// getVerifiedSnippetWithNoLog();

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
