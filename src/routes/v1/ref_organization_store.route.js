const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const ref_organization_storeController = require('../../controllers/ref_organization_store.controller');
const { paramSchema } = require('../../validations');

const router = express.Router();

router.post(
  '/',
  validate(paramSchema.ref_organization_store.createRef_organization_store),
  ref_organization_storeController.createRef_organization_store
);
router.get(
  '/',
  validate(paramSchema.ref_organization_store.getRef_organization_stores),
  ref_organization_storeController.getRef_organization_stores
);
router.get(
  '/:id',
  validate(paramSchema.ref_organization_store.getRef_organization_store),
  ref_organization_storeController.getRef_organization_store
);
router.put(
  '/',
  validate(paramSchema.ref_organization_store.updateRef_organization_store),
  ref_organization_storeController.updateRef_organization_store
);
router.delete(
  '/',
  validate(paramSchema.ref_organization_store.deleteRef_organization_store),
  ref_organization_storeController.deleteRef_organization_store
);

module.exports = router;
