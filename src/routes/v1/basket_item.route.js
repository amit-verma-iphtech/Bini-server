const express = require('express');
const basketItemController = require('../../controllers/basket_item.controller');

const router = express.Router();

router.get('/', basketItemController.getBasketItems);
router.post('/add-remove', basketItemController.createBasketItem);
router.route('/:basketItemId').delete(basketItemController.deleteBasketItem).get(basketItemController.getBasketItem);

module.exports = router;
