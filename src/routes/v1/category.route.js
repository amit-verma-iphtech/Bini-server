const express = require('express');
const categoryController = require('../../controllers/category.controller');

const router = express.Router();
const validate = require('../../middlewares/validate');
const { paramSchema } = require('../../validations');
// CRUD:
router.get('/all', validate(paramSchema.category.getAllCategory), categoryController.getCategories);

router.route('/').post(validate(paramSchema.category.createCategory), categoryController.createCategory);
router
  .route('/:categoryId')
  .get(validate(paramSchema.category.getCategory), categoryController.getCategory)
  .put(validate(paramSchema.category.updateCategory), categoryController.updateCategory)
  .delete(validate(paramSchema.category.deleteCategory), categoryController.deleteCategory);
module.exports = router;
