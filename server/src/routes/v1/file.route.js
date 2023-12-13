const express = require('express');
const fileController = require('../../controllers/file.controller');
const auth = require('../../middlewares/auth');
const uploadMiddleware = require('../../middlewares/fileUpload');
const validate = require('../../middlewares/validate');
const fileValidation = require("../../validations/file.validation");

const router = express.Router();

router
    .route('/')
    .post(uploadMiddleware.single('picture'), validate(fileValidation.createFile), fileController.uploadFile)
    .get(validate(fileValidation.getFiles), fileController.getFiles)
router
    .route('/:fileId')
    .get(validate(fileValidation.getFile), fileController.getFile)
    .patch(validate(fileValidation.updateFile), fileController.updateFile)
    .delete(validate(fileValidation.deleteFile), fileController.deleteFile)

module.exports = router;
