const Joi = require('joi');
const {objectId} = require('./custom.validation');

const createRecipe = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        ingredients: Joi.array()
            .items(Joi.object({
                ingredient: Joi.string().required(),
                measure: Joi.string().required()
            })).min(1)
            .required(),
        postedBy: Joi.string().required(),
        category: Joi.string().required(),
        preparationMethod: Joi.string().required(),
        preparationTime: Joi.number().required(),
        portionsNumber: Joi.number().required(),
        picture: Joi.string(),
        dietaryPreferences: Joi.object().keys({
            vegan: Joi.boolean(),
            halal: Joi.boolean(),
            kosher: Joi.boolean(),
            vegetarian: Joi.boolean(),
            glutenFree: Joi.boolean()
        }),
        comment: Joi.string().allow('').optional()
    })
};

const getRecipes = {
    query: Joi.object().keys({
        title: Joi.string(),
        postedBy: Joi.string(),
        category: Joi.string(),
        preparationMethod: Joi.string(),
        preparationTime: Joi.number(),
        portionsNUmber: Joi.number(),
        files: Joi.string(),
        ingredients: Joi.array().items(Joi.object({
            ingredient: Joi.string().required(),
            measure: Joi.string()
        })),
        dietaryPreferences: Joi.object().keys({
            vegan: Joi.boolean(),
            halal: Joi.boolean(),
            kosher: Joi.boolean(),
            vegetarian: Joi.boolean(),
            glutenFree: Joi.boolean()
        }),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        populate: Joi.string()
    })
};

const getRecipe = {
    params: Joi.object().keys({
        recipeId: Joi.string().custom(objectId)
    })
};

const updateRecipe = {
    params: Joi.object().keys({
        recipeId: Joi.required().custom(objectId)
    }),
    body: Joi.object().keys({
        title: Joi.string(),
        postedBy: Joi.string(),
        category: Joi.string(),
        preparationMethod: Joi.string(),
        preparationTime: Joi.number(),
        portionsNUmber: Joi.number(),
        files: Joi.string(),
        ingredients: Joi.array().items(Joi.object({
            ingredient: Joi.string().required(),
            measure: Joi.string().required()
        })),
        dietaryPreferences: Joi.object().keys({
            vegan: Joi.boolean(),
            halal: Joi.boolean(),
            kosher: Joi.boolean(),
            vegetarian: Joi.boolean(),
            glutenFree: Joi.boolean()
        }),

    })
};

const deleteRecipe = {
    params: Joi.object().keys({
        recipeId: Joi.string().custom(objectId),
    }),
};


module.exports = {
    createRecipe,
    getRecipe,
    getRecipes,
    updateRecipe,
    deleteRecipe
};
