const httpStatus = require('http-status');
const {Recipe} = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a recipe
 * @param {Object} recipeBody
 * @returns {Promise<Recipe>}
 */
const createRecipe = async (recipeBody) => {
    return Recipe.create(recipeBody);
};

/**
 * Query for recipes
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRecipes = async (filter, options) => {

    if(filter.title){
        filter.title=new RegExp(filter.title,'i');
    }

    //console.log('filter: ',filter);


    if (filter.ingredients) {
        const ingredientIds = filter.ingredients.map(ingredient => ingredient.ingredient);

        filter = { 'ingredients.ingredient': { $in: ingredientIds } };
    }
    console.log("service filter: ",filter);
    const recipes = await Recipe.paginate(filter, options);

    console.log("filter afte")
    console.log("service recipe: ",recipes);

    return recipes;
}

/**
 * Get recipe by id
 * @param {ObjectId} id
 * @returns {Promise<Recipe>}
 */
const getRecipeById = async (id) => {
    return Recipe.findById(id);
};

/**
 * Update recipe by id
 * @param {ObjectId} recipeId
 * @param {Object} updateBody
 * @returns {Promise<Recipe>}
 */
const updateRecipeById = async (recipeId, updateBody) => {
    const recipe = await getRecipeById(recipeId);
    if (!recipe) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
    }
    Object.assign(recipe, updateBody);
    await recipe.save();
    return recipe;
};

/**
 * Delete recipe by id
 * @param {ObjectId} recipeId
 * @returns {Promise<Recipe>}
 */
const deleteRecipeById = async (recipeId) => {
    const recipe = await getRecipeById(recipeId);
    if (!recipe) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
    }
    await recipe.deleteOne();
    return recipe;
};

const getNumberOfRecipes=async()=>{
    const number=await Recipe.countDocuments({});
    return number;
};

module.exports = {
    createRecipe,
    queryRecipes,
    getRecipeById,
    updateRecipeById,
    deleteRecipeById,
    getNumberOfRecipes
};
