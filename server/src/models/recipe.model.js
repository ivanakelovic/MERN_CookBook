const mongoose = require('mongoose');
const {toJSON, paginate} = require('./plugins');
const {mongo} = require("mongoose");

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A recipe must have a title!'],
        trim: true
    },
    ingredients: {
        type: [{
            ingredient: {type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'},
            measure: String
        }],
        required: [true, 'A recipe must have ingredients!'],
    },
    postedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    category: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category'
    },
    preparationMethod: {
        type: String,
        required: [true, 'A recipe must have a preparation method!'],
        trim: true
    },
    preparationTime: {
        type: Number,
        required: [true, 'A recipe must have a preparation time!'],
        trim: true
    },
    portionsNumber: {
        type: Number,
        required: [true, 'A recipe must have a portions number!'],
        trim: true
    },
    picture: {
        type: mongoose.SchemaTypes.ObjectId,
        ref:'File',
        required: [true, 'A recipe must have a picture!'],
        trim: true
    },
    dietaryPreferences: {
        vegan: Boolean,
        halal: Boolean,
        kosher: Boolean,
        vegetarian: Boolean,
        glutenFree: Boolean
    },
    comment:{
        type:String
    }
}, {
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps: true
});

recipeSchema.virtual('ingredientsList',{
    ref:'Ingredient',
    localField:'_id',
    foreignField:'ingredients'
})

recipeSchema.plugin(toJSON);
recipeSchema.plugin(paginate);

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
