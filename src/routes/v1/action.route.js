const express = require('express');
const actionController = require('../../controllers/action.controller');

const router = express.Router();

router.get('/', actionController.getActions);
router.post('/', actionController.createAction);
router
  .route('/:actionId')
  .delete(actionController.deleteAction)
  .put(actionController.updateAction)
  .get(actionController.getAction);

module.exports = router;
