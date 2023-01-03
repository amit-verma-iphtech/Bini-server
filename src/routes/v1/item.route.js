const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const itemController = require('../../controllers/item.controller');
const { paramSchema } = require('../../validations');
const { ref_item_storeController } = require('../../controllers');

const router = express.Router();

// need to remove this.. once next app build deployed
router.get('/all', validate(paramSchema.ref_item_store.getStoreProducts), ref_item_storeController.getStoreProducts);

router.post('/', validate(paramSchema.item.createItem), itemController.createItem);
router.get('/', validate(paramSchema.item.getItems), itemController.getItems);
router.get('/:id', validate(paramSchema.item.getItem), itemController.getItem);
router.put('/', validate(paramSchema.item.updateItem), itemController.updateItem);
router.delete('/', validate(paramSchema.item.deleteItem), itemController.deleteItem);

module.exports = router;
