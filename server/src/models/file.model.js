const mongoose = require("mongoose");
const {toJSON, paginate} = require('./plugins');

const fileSchema = new mongoose.Schema({

        originalName: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        fileType: {
            type: String,
            required: true
        },
        fileSize: {
            type: Number,
            required: true
        }

    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
        timestamps: true
    }
);

// add plugin that converts mongoose to json
fileSchema.plugin(toJSON);
fileSchema.plugin(paginate);


const File = mongoose.model('File', fileSchema);

module.exports = File;
