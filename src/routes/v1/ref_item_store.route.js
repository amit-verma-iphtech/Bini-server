const express = require('express');
const validate = require('../../middlewares/validate');

const { ref_item_storeController } = require('../../controllers');
const { paramSchema } = require('../../validations');

const router = express.Router();

router.post('/', validate(paramSchema.ref_item_store.createStoreProduct), ref_item_storeController.createStoreProduct);
router.get('/', validate(paramSchema.ref_item_store.getStoreProducts), ref_item_storeController.getStoreProducts);
router.get('/:id', validate(paramSchema.ref_item_store.getStoreProduct), ref_item_storeController.getStoreProduct);
router.put('/', validate(paramSchema.ref_item_store.updateStoreProduct), ref_item_storeController.updateStoreProduct);
router.delete('/', validate(paramSchema.ref_item_store.deleteStoreProduct), ref_item_storeController.deleteStoreProduct);

module.exports = router;
