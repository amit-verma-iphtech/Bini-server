const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser)
  .get(validate(userValidation.getUsers), userController.getUsers);
// .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
// .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

router.route('/email/:email').get(userController.getUserByEmail);
router
  .route('/:userId')
  .get(validate(userValidation.getUser), userController.getUser)
  .put(validate(userValidation.updateUser), userController.updateUser)
  .delete(validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
