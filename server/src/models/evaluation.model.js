const mongoose=require('mongoose');
const {Schema}=mongoose;
const {toJSON,paginate}=require('./plugins');

const evaluationSchema=new Schema({

    rating:{
        type:Number,
        min:[1,"Minimum rating is 1!!!"],
        max:[5,"Maximum rating is 5!!!"],
        required:[true,'Rating is required'],
    },
    comment:{
        type:String
    },
    recipeId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Recipe',
        required:[true,'Recipe ID is required'],
    },
    evaluatedBy:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required:[true,'Evaluated By Field is required'],
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true
});

evaluationSchema.plugin(toJSON);
evaluationSchema.plugin(paginate);

const Evaluation=mongoose.model('Evaluation',evaluationSchema);
module.exports=Evaluation;



