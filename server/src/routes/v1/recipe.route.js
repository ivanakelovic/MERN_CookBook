const express = require('express');
const uploadMiddleware = require('../../middlewares/fileUpload');
const validate = require('../../middlewares/validate');
const recipeValidation = require('../../validations/recipe.validation');
const recipeController = require('../../controllers/recipe.controller');

const router = express.Router();

router
    .route('/')
    .post(uploadMiddleware.single('picture'), validate(recipeValidation.createRecipe), recipeController.createRecipe)
    .get(validate(recipeValidation.getRecipes), recipeController.getRecipes)

router
    .route('/:recipeId')
    .get(validate(recipeValidation.getRecipe), recipeController.getRecipe)
    .put(validate(recipeValidation.updateRecipe), recipeController.updateRecipe)
    .delete(validate(recipeValidation.deleteRecipe), recipeController.deleteRecipe)

module.exports = router;