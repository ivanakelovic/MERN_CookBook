const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const categoryValidation = require('../../validations/category.validation');
const categoryController = require('../../controllers/category.controller');

const router = express.Router();

router
    .route('/')
    .post(validate(categoryValidation.createCategory), categoryController.createCategory)
    .get(validate(categoryValidation.getCategories), categoryController.getCategories)

router
    .route('/:categoryId')
    .get(validate(categoryValidation.getCategory), categoryController.getCategory)
    .put(validate(categoryValidation.updateCategory), categoryController.updateCategory)
    .delete(validate(categoryValidation.deleteCategory), categoryController.deleteCategory)

module.exports = router;