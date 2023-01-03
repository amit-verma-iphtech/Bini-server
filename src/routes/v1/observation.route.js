const express = require('express');
const observationController = require('../../controllers/observation.controller');

const validate = require('../../middlewares/validate');
const { paramSchema } = require('../../validations');

const router = express.Router();

router.get('/', observationController.getObservations);
router.get('/view/all', observationController.viewAllObservations);
router.get('/', observationController.getObservations);
router.post('/multiple/verify', validate(paramSchema.observation.verifyMultiple), observationController.multipleVerify);
router.post('/multiple/update', validate(paramSchema.observation.updateMany), observationController.updateMany);
router.post(
  '/multiple/unverify',
  validate(paramSchema.observation.unVerifyMultiple),
  observationController.multipleUnVerify
);

router.get('/extra', observationController.getExtraObservations);
router.get('/free', observationController.freeUnverifiedObservations);
router.post('/verified', observationController.getVerifiedObservations);
router.post(
  '/assigned',
  validate(paramSchema.observation.getAssignedObservations),
  observationController.getAssignedObservations
);
router.post('/', observationController.createObservation);
router
  .route('/:observationId')
  .delete(observationController.deleteObservation)
  .put(observationController.updateObservation)
  .get(observationController.getObservation);

module.exports = router;
