const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const ref_organization_userController = require('../../controllers/ref_organization_user.controller');
const { paramSchema } = require('../../validations');

const router = express.Router();

router.post(
  '/',
  validate(paramSchema.ref_organization_user.createRef_organization_user),
  ref_organization_userController.createRef_organization_user
);
router.get(
  '/',
  validate(paramSchema.ref_organization_user.getRef_organization_users),
  ref_organization_userController.getRef_organization_users
);
router.get(
  '/:id',
  validate(paramSchema.ref_organization_user.getRef_organization_user),
  ref_organization_userController.getRef_organization_user
);
router.put(
  '/',
  validate(paramSchema.ref_organization_user.updateRef_organization_user),
  ref_organization_userController.updateRef_organization_user
);
router.delete(
  '/',
  validate(paramSchema.ref_organization_user.deleteRef_organization_user),
  ref_organization_userController.deleteRef_organization_user
);

module.exports = router;
