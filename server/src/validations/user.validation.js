const Joi = require('joi');
const {password, objectId} = require('./custom.validation');

const createUser = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        role: Joi.string().valid('admin', 'user').default('user'),
        favorites: Joi.object().pattern(
            Joi.string(),
            Joi.boolean()
        ).default({}),
        picture:Joi.string()
    })
};

const getUsers = {
    query: Joi.object().keys({
        firstName: Joi.string(),
        lastName: Joi.string(),
        role: Joi.string(),
        favorites: Joi.object().pattern(
            Joi.string(),
            Joi.boolean()
        ).default({}),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        populate:Joi.string()
    })
};

const getUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId)
    })
};

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.required().custom(objectId)
    }),
    body: Joi.object().keys({
        firstName: Joi.string(),
        lastName: Joi.string(),
        role: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string().custom(password).optional(),
        favorites: Joi.object().pattern(
            Joi.string().custom(objectId),
            Joi.boolean()
        ),
        picture:Joi.string()
    })
};

const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

const addFavorite = {
    params: Joi.object().keys({
        recipeId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

const removeFavorite = {
    params: Joi.object().keys({
        recipeId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};



module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    addFavorite,
    removeFavorite,
};
