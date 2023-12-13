const express = require('express');
const validate = require('../../middlewares/validate');
const evaluationValidation = require('../../validations/evaluation.validation');
const evaluationController = require('../../controllers/evaluation.controller');

const router = express.Router();

router
    .route('/')
    .post(validate(evaluationValidation.createEvaluation), evaluationController.createEvaluation)
    .get(validate(evaluationValidation.getEvaluations), evaluationController.getEvaluations);

router
    .route('/:evaluationId')
    .get(validate(evaluationValidation.getEvaluation), evaluationController.getEvaluation)
    .put(validate(evaluationValidation.updateEvaluation), evaluationController.updateEvaluation)
    .delete(validate(evaluationValidation.deleteEvaluation), evaluationController.deleteEvaluation);

module.exports = router;