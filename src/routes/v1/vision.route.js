const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const visionController = require('../../controllers/vision.controller');

const router = express.Router();

router.get('/create-upload-url', visionController.createUploadUrl);
router.post('/create-productset', visionController.createProductSet);
router.post('/create-product', visionController.createProduct);
router.post('/add-product-to-productset', visionController.addProductToProductSet);
router.post('/create-referenceimage', visionController.createReferenceImage);
router.post('/get-similar-productfiles', visionController.getSimilarProductsFile);

router.get('/process-video', visionController.processVideo);

module.exports = router;
