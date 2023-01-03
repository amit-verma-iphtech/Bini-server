const visit = require('./visit.validation');
const auth = require('./auth.validation');
const user = require('./user.validation');
const item = require('./item.validation');
const category = require('./category.validation');
const observation = require('./observation.validation');
const stripe = require('./stripe.validation');
const notification = require('./notification.validation');
const ref_item_store = require('./ref_item_store.validation');
const organization = require('./organization.validation');
const ref_organization_store = require('./ref_organization_store.validation');
const ref_organization_user = require('./ref_organization_user.validation');
const store = require('./store.validation');

const paramSchema = {
  visit,
  auth,
  user,
  item,
  category,
  observation,
  stripe,
  notification,
  ref_item_store,
  organization,
  ref_organization_store,
  ref_organization_user,
  store,
};
module.exports.paramSchema = paramSchema;
