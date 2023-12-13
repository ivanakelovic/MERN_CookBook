const express = require('express');
const validate = require('../../middlewares/validate');
const ingredientValidation = require('../../validations/ingredient.validation');
const ingredientController = require('../../controllers/ingredient.controller');

const router = express.Router();

router
    .route('/')
    .post(validate(ingredientValidation.createIngredient), ingredientController.createIngredient)
    .get(validate(ingredientValidation.getIngredients), ingredientController.getIngredients)

router
    .route('/:ingredientId')
    .get(validate(ingredientValidation.getIngredient), ingredientController.getIngredient)
    .put(validate(ingredientValidation.updateIngredient), ingredientController.updateIngredient)
    .delete(validate(ingredientValidation.deleteIngredient), ingredientController.deleteIngredient)

module.exports = router;
