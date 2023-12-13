const {fileService} = require('../services');
const {createFile} = require('../services/file.service');
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const pick = require("../utils/pick");
const fs = require("fs");
const path = require("path");

const uploadFile = async (req, res) => {
  try {
   // console.log('req.body:', req.body);
    //console.log('req.file:', req.file);
    const file = req.file;

    if (!file) {
      // return res.status(400).json({ error: 'No file was uploaded.' });

      console.log('no file was uploaded');
    }

    const {originalname, filename, mimetype, size} = file;

    /*if (mimetype !== 'text/plain' || mimetype!=='application/pdf') {
      fs.unlinkSync(file.path);
      return res.status(400).json({error: 'Invalid file type. Only .txt files are allowed.'});
    }*/
    const savedFile = await createFile(req.body, file);

    return res.status(200).json(savedFile);
  } catch (error) {
    console.error('Error occurred while saving file:', error);
    // return res.status(500).json({ error: 'Error occurred while saving file' });
  }
};


const getFile = catchAsync(async (req, res) => {
  const file = await fileService.getFileById(req.params.fileId);
 // console.log('file: ',file);

  //console.log('fileName: ', file.fileName);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  res.send(file);
 /* const read = fs.createReadStream(path.resolve(__dirname, `../../file/${file.fileName}`));
  read.pipe(res);*/
});

const getFiles = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['createdBy', 'fileType', 'getFiles', 'fileSize']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await fileService.queryFiles(filter, options);
  res.send(result);
})

const updateFile = catchAsync(async (req, res) => {
  const file = await fileService.updateFileById(req.params.fileId, req.body);
  res.send(file);
});

const deleteFile = catchAsync(async (req, res) => {
  await fileService.deleteFileById(req.params.fileId);
  res.status(httpStatus.NO_CONTENT).send();
});


module.exports = {
  uploadFile,
  getFile,
  getFiles,
  updateFile,
  deleteFile
};
