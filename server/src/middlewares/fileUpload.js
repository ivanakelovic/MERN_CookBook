const multer = require('multer');
const path = require('path');
const {v4: uuidv4} = require('uuid');

const uploadDestination = path.join(__dirname, '../../file');

const uploadMiddleware = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDestination);
        },
        filename: function (req, file, cb) {
            const fileExtension = path.extname(file.originalname);
            const uniqueFileName = `${uuidv4()}${fileExtension}`;
            cb(null, uniqueFileName);
        },
    }),
});

module.exports = uploadMiddleware;

