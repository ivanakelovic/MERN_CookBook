const httpStatus = require('http-status');
const {Ingredient} = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an ingredient
 * @param {Object} ingredientBody
 * @returns {Promise<Ingredient>}
 */
const createIngredient = async (ingredientBody) => {
    return Ingredient.create(ingredientBody);
};

/**
 * Query for ingredients
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryIngredients = async (filter, options) => {

    if(filter.name){
        filter.name=new RegExp(filter.name,'i');
    }

    console.log('filter: ',filter);

    const ingredients = await Ingredient.paginate(filter, options);
    return ingredients;
};

/**
 * Get ingredient by id
 * 
 * @param {ObjectId} id
 * @returns {Promise<Ingredient>}
 */
const getIngredientById = async (id) => {
    return Ingredient.findById(id);
};


/**
 * Update ingredient by id
 * @param {ObjectId} ingredientId
 * @param {Object} updateBody
 * @returns {Promise<Ingredient>}
 */
const updateIngredientById = async (ingredientId, updateBody) => {
    const ingredient = await getIngredientById(ingredientId);
    if (!ingredient) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Ingredient not found');
    }

    Object.assign(ingredient, updateBody);
    await ingredient.save();
    return ingredient;
};

/**
 * Delete ingredient by id
 * @param {ObjectId} ingredientId
 * @returns {Promise<Ingredient>}
 */
const deleteIngredientById = async (ingredientId) => {
    const ingredient = await getIngredientById(ingredientId);
    if (!ingredient) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Ingredient not found');
    }
    await ingredient.deleteOne();
    return ingredient;
};

const getNumberOfIngredients=async()=>{
    const number=await Ingredient.countDocuments({});
    return number;
};

module.exports = {
    createIngredient,
    queryIngredients,
    getIngredientById,
    updateIngredientById,
    deleteIngredientById,
    getNumberOfIngredients
};
