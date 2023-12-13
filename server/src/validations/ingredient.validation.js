const Joi = require('joi');
const {objectId} = require('./custom.validation');

const createIngredient = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        vegan: Joi.boolean().required(),
        glutenFree: Joi.boolean().required(),
        vegetarian: Joi.boolean().required(),
        halal: Joi.boolean().required(),
        kosher: Joi.boolean().required(),
        calories:Joi.number().required()
    })
};

const getIngredients = {
    query: Joi.object().keys({
        name: Joi.string(),
        vegan: Joi.boolean(),
        glutenFree: Joi.boolean(),
        vegetarian: Joi.boolean(),
        halal: Joi.boolean(),
        calories:Joi.number(),
        kosher: Joi.boolean(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    })
};

const getIngredient = {
    params: Joi.object().keys({
        ingredientId: Joi.string().custom(objectId)
    })
};

const updateIngredient = {
    params: Joi.object().keys({
        ingredientId: Joi.required().custom(objectId)
    }),
    body: Joi.object().keys({
        name: Joi.string(),
        vegan: Joi.boolean(),
        glutenFree: Joi.boolean(),
        vegetarian: Joi.boolean(),
        halal: Joi.boolean(),
        kosher: Joi.boolean(),
        calories:Joi.number()
    })
};

const deleteIngredient = {
    params: Joi.object().keys({
        ingredientId: Joi.string().custom(objectId),
    }),
};


module.exports = {
    createIngredient,
    getIngredients,
    getIngredient,
    updateIngredient,
    deleteIngredient
};
