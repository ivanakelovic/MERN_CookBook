const httpStatus = require('http-status');
const {Evaluation} = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an evaluation
 * @param {Object} evaluationBody
 * @returns {Promise<Evaluation>}
 */
const createEvaluation = async (evaluationBody) => {
    return Evaluation.create(evaluationBody);
};

/**
 * Query for evaluations
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryEvaluations = async (filter, options) => {
    const evaluations = await Evaluation.paginate(filter, options);
    return evaluations;
};

/**
 * Get evaluation by id
 * @param {ObjectId} id
 * @returns {Promise<Evaluation>}
 */
const getEvaluationById = async (id) => {
    return Evaluation.findById(id);
};


/**
 * Update evaluation by id
 * @param {ObjectId} evaluationId
 * @param {Object} updateBody
 * @returns {Promise<Evaluation>}
 */
const updateEvaluationById = async (evaluationId, updateBody) => {
    const evaluation = await getEvaluationById(evaluationId);
    if (!evaluation) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Evaluation not found');
    }

    Object.assign(evaluation, updateBody);
    await evaluation.save();
    return evaluation;
};

/**
 * Delete evaluation by id
 * @param {ObjectId} evaluationId
 * @returns {Promise<evaluation>}
 */
const deleteEvaluationById = async (evaluationId) => {
    const evaluation = await getEvaluationById(evaluationId);
    if (!evaluation) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Evaluation not found');
    }
    await evaluation.remove();
    return evaluation;
};

module.exports = {
    createEvaluation,
    queryEvaluations,
    getEvaluationById,
    updateEvaluationById,
    deleteEvaluationById
};
