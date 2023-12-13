const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {recipeService, fileService} = require('../services');
const {uploadFile} = require("./file.controller");
const {Error} = require("mongoose");
const mongoose = require("mongoose");
const {getIngredientById} = require("../services/ingredient.service");

const createRecipe = catchAsync(async (req, res) => {

    const saveFile = await uploadFile(req, res);

    const files = await fileService.queryFiles({}, {limit: 9999999})

    const lastUploadedFile = files.results[files.results.length - 1];

    console.log('req.boyd recipe',req.body);
    console.log('ing',req.body);
    dietaryPref = await calculateDietaryPreferences(req.body.ingredients);

        const recipeData = {
            ...req.body,
            picture: lastUploadedFile.id,
            dietaryPreferences:dietaryPref
           
        };

        const recipe = await recipeService.createRecipe(recipeData);
        // res.send(recipe);
   
});

const calculateDietaryPreferences = async (ingredients) => {
    const preferences = {
        vegan: true,
        halal: true,
        kosher: true,
        vegetarian: true,
        glutenFree: true,
    };

    console.log("ingredients: ", ingredients);

    for (const ingredient of ingredients) {
        if (!ingredient.ingredient) {
            throw new Error('Ingredient not found');
        }

        const ingredientInfo = await getIngredientById(ingredient.ingredient);

        console.log('ingredientinfo: ', ingredientInfo);
        console.log("ingredientinfo.halal: ", ingredientInfo.halal);

        if (!ingredientInfo.vegan) {
            preferences.vegan = false;
        }
        if (!ingredientInfo.halal) {
            preferences.halal = false;
        }
        console.log("halal: ", ingredientInfo.halal);
        if (!ingredientInfo.kosher) {
            preferences.kosher = false;
        }
        if (!ingredientInfo.vegetarian) {
            preferences.vegetarian = false;
        }
        if (!ingredientInfo.glutenFree) {
            preferences.glutenFree = false;
        }
    }

    console.log('preferences: ', preferences);
    return preferences;
};


const getRecipes = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['title', 'preparationMethod', 'preparationTime','category','ingredients','postedBy','dietaryPreferences']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await recipeService.queryRecipes(filter, options);

    console.log("controller recipe: ",result);
    console.log("controler filters",filter);
    console.log("controller options",options);
    console.log("req. query",req.query);
    console.log("filter: ",filter);
    res.send(result);
});

const getRecipe = catchAsync(async (req, res) => {
    const recipe = await recipeService.getRecipeById(req.params.recipeId);
    if (!recipe) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
    }
    await recipe.populate('ingredientsList');

    res.send(recipe);
});

const updateRecipe = catchAsync(async (req, res) => {
    const recipe = await recipeService.updateRecipeById(req.params.recipeId, req.body);
    res.send(recipe);
});

const deleteRecipe = catchAsync(async (req, res) => {
    await recipeService.deleteRecipeById(req.params.recipeId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createRecipe,
    getRecipes,
    getRecipe,
    updateRecipe,
    deleteRecipe,
};
