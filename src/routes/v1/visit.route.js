const express = require('express');
const visitController = require('../../controllers/visit.controller');
const validate = require('../../middlewares/validate');
const { paramSchema } = require('../../validations');

const router = express.Router();

router.get('/', validate(paramSchema.visit.getVisit), visitController.getVisits);
router.post('/', validate(paramSchema.visit.createVisit), visitController.createVisit);
router.post(
  '/get-by-store-customer-id',
  validate(paramSchema.visit.getActiveVisitByStoreCustomerId),
  visitController.getActiveVisitByStoreCustomerId
);
router.post('/images', validate(paramSchema.visit.getVisitImages), visitController.getVisitImages);
router.post('/save-anonymous', validate(paramSchema.visit.saveAnonymous), visitController.saveAnonymous);
router.route('/:visitId').delete(visitController.deleteVisit).put(visitController.updateVisit).get(visitController.getVisit);

module.exports = router;
