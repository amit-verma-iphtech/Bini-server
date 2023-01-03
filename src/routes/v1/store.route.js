const express = require('express');

const storeController = require('../../controllers/store.controller');
const validate = require('../../middlewares/validate');
const { paramSchema } = require('../../validations');

const router = express.Router();

// CRUD:
router.post('/', validate(paramSchema.store.createStore), storeController.createStore);
router.get('/', validate(paramSchema.store.getStores), storeController.getStores);
router.get('/:id', validate(paramSchema.store.getStore), storeController.getStore);
router.put('/', validate(paramSchema.store.updateStore), storeController.updateStore);
router.delete('/', validate(paramSchema.store.deleteStore), storeController.deleteStore);
module.exports = router;
