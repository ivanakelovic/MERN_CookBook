const mongoose = require('mongoose');
const {toJSON, paginate} = require('./plugins');

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    vegan: {
        type: Boolean,
        required: true
    },
    glutenFree: {
        type: Boolean,
        required: true
    },
    vegetarian: {
        type: Boolean,
        required: true
    },
    halal: {
        type: Boolean,
        required: true
    },
    kosher: {
        type: Boolean,
        required: true
    },
    calories:{
        type:Number,
        required:true
    }
}, {
    timestamps: true
});

ingredientSchema.plugin(toJSON);
ingredientSchema.plugin(paginate);

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;