const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {ingredientService} = require('../services');

const createIngredient = catchAsync(async (req, res) => {
    const ingredient = await ingredientService.createIngredient(req.body);
    res.status(httpStatus.CREATED).send(ingredient);
});

const getIngredients = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'vegan', 'vegeterian', 'halal', 'kosher', 'glutenFree']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await ingredientService.queryIngredients(filter, options);
    res.send(result);
});

const getIngredient = catchAsync(async (req, res) => {
    const ingredient = await ingredientService.getIngredientById(req.params.ingredientId);
    if (!ingredient) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Ingredient not found');
    }
    res.send(ingredient);
});

const updateIngredient = catchAsync(async (req, res) => {
    const ingredient = await ingredientService.updateIngredientById(req.params.ingredientId, req.body);
    res.send(ingredient);
});

const deleteIngredient = catchAsync(async (req, res) => {
    await ingredientService.deleteIngredientById(req.params.ingredientId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createIngredient,
    getIngredients,
    getIngredient,
    updateIngredient,
    deleteIngredient
};
