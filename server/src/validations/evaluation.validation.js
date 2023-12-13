const Joi = require('joi');
const {password, objectId} = require('./custom.validation');

const createEvaluation = {
    body: Joi.object().keys({
        rating:Joi.number().integer().min(1).max(5).positive().required(),
       comment:Joi.string(),
       recipeId:Joi.string().required(),
       evaluatedBy:Joi.string().required()
    })
};

const getEvaluations = {
    query: Joi.object().keys({
        rating:Joi.number().integer().min(1).max(5).positive(),
        comment:Joi.string(),
        recipeId:Joi.string(),
        evaluatedBy:Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    })
};

const getEvaluation = {
    params: Joi.object().keys({
        evaluationId: Joi.string().custom(objectId)
    })
};

const updateEvaluation = {
    params: Joi.object().keys({
        evaluationId: Joi.required().custom(objectId)
    }),
    body: Joi.object().keys({
       rating:Joi.number().integer().min(1).max(5).positive(),
       comment:Joi.string(),
       recipeId:Joi.string(),
       evaluatedBy:Joi.string()
    })
};

const deleteEvaluation = {
    params: Joi.object().keys({
        evaluationId: Joi.string().custom(objectId),
    }),
};


module.exports = {
    createEvaluation,
    getEvaluations,
    getEvaluation,
    updateEvaluation,
    deleteEvaluation,
};
