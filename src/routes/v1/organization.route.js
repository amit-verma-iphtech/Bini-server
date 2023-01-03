const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const organizationController = require('../../controllers/organization.controller');
const { paramSchema } = require('../../validations');
const { ref_organization_storeController } = require('../../controllers');

const router = express.Router();

router.post('/', validate(paramSchema.organization.createOrganization), organizationController.createOrganization);
router.get('/', validate(paramSchema.organization.getOrganizations), organizationController.getOrganizations);
router.get('/:id', validate(paramSchema.organization.getOrganization), organizationController.getOrganization);
router.put('/', validate(paramSchema.organization.updateOrganization), organizationController.updateOrganization);
router.delete('/', validate(paramSchema.organization.deleteOrganization), organizationController.deleteOrganization);

module.exports = router;
