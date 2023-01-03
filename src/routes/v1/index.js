const express = require('express');
const adminRoute = require('./admin.route');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const visitRoute = require('./visit.route');
const observationRoute = require('./observation.route');
const actionRoute = require('./action.route');
const itemRoute = require('./item.route');
const storeRoute = require('./store.route');
const transactionRoute = require('./transaction.route');
const chatbotRoute = require('./chatbot.route');
const visionRoute = require('./vision.route');
const doorRoute = require('./door.route');
const basketRoute = require('./basket.route');
const basketItemRoute = require('./basket_item.route');
const tagsRoute = require('./tag.route');
const categoryRoute = require('./category.route');
const docsRoute = require('./docs.route');
const gebitRoute = require('./gebit.route');
const streamRoute = require('./stream.route');
const cameraRoute = require('./camera.route');
const config = require('../../config/config');
const nukiRoute = require('./nuki.route');
const stripeRoute = require('./stripe.route');
const ref_item_storeRoute = require('./ref_item_store.route');
const notificationRoute = require('./notification.route');
const organizationRoute = require('./organization.route');
const ref_organization_storeRoute = require('./ref_organization_store.route');
const ref_organization_userRoute = require('./ref_organization_user.route');

const router = express.Router({ mergeParams: true });

const defaultRoutes = [
  {
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/items',
    route: itemRoute,
  },
  {
    path: '/stores',
    route: storeRoute,
  },
  {
    path: '/transactions',
    route: transactionRoute,
  },
  {
    path: '/chatbot',
    route: chatbotRoute,
  },
  {
    path: '/vision',
    route: visionRoute,
  },
  {
    path: '/door',
    route: doorRoute,
  },
  {
    path: '/tags',
    route: tagsRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/nuki',
    route: nukiRoute,
  },
  {
    path: '/visits',
    route: visitRoute,
  },
  {
    path: '/observations',
    route: observationRoute,
  },
  {
    path: '/actions',
    route: actionRoute,
  },
  {
    path: '/baskets',
    route: basketRoute,
  },
  {
    path: '/basket-items',
    route: basketItemRoute,
  },
  {
    path: '/gebit',
    route: gebitRoute,
  },
  {
    path: '/stream',
    route: streamRoute,
  },
  {
    path: '/camera',
    route: cameraRoute,
  },
  {
    path: '/stripe',
    route: stripeRoute,
  },
  {
    path: '/store-products',
    route: ref_item_storeRoute,
  },
  {
    path: '/notification',
    route: notificationRoute,
  },
  {
    path: '/organizations',
    route: organizationRoute,
  },
  {
    path: '/organizations/store/access',
    route: ref_organization_storeRoute,
  },
  {
    path: '/organizations/user/access',
    route: ref_organization_userRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
