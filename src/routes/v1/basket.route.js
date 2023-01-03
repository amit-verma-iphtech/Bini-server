const express = require('express');
const basketController = require('../../controllers/basket.controller');

const router = express.Router();

router.get('/', basketController.getBaskets);
router.get('/history', basketController.getPaidBaskets);
router.post('/', basketController.createBasket);
router
  .route('/:basketId')
  .delete(basketController.deleteBasket)
  .put(basketController.updateBasket)
  .get(basketController.getBasket);

module.exports = router;
