const {File} = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const queryFiles = async (filter, options) => {
  const files = await File.paginate(filter, options);
  return files;
};

const createFile = async (fileBody, file) => {
  try {
    console.log('file service: ');
    

    const {originalname, filename, mimetype, size} = file;

    console.log('file ',file);
    console.log('filebody: ',fileBody);

    const newFile = new File({
      originalName: originalname,
      fileName: filename,
      fileType: mimetype,
      fileSize: size,
      createdBy: fileBody.createdBy
    });

    const savedFile = await newFile.save();
    return savedFile;
  } catch (error) {
    console.error('Error while saving file to database:', error);
    throw error;
  }
};

const getFileById = async (id) => {
  return File.findById(id);
};

const updateFileById = async (fileId, updateBody) => {
  const file = await getFileById(fileId);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  Object.assign(file, updateBody);
  await file.save();
  return file;
};

const deleteFileById = async (fileId) => {
  const file = await getFileById(fileId);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  await file.remove();
  return file;
};

module.exports = {
  queryFiles,
  createFile,
  getFileById,
  deleteFileById,
  updateFileById
};
