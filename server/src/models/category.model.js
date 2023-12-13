const mongoose = require('mongoose');
const {toJSON, paginate} = require('./plugins');

const categorySchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    });

categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;