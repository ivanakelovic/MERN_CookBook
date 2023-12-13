const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
    .route('/:recipeId')
    .post(validate(userValidation.addFavorite),userController.addFavorite)
    .delete(validate(userValidation.removeFavorite),userController.removeFavorite)

module.exports = router;