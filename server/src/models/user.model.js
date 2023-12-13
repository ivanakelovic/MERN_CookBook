const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const {roles} = require('../config/roles');
const {toJSON, paginate} = require('./plugins');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'User must have first name'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'User must have last name'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'User must have email!'],
            trim: true,
            lowercase: true,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            }
        },
        password: {
            type: String,
            required: [true, 'User must have password!'],
            trim: true,
            minlength: 8,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error('Password must contain at least one letter and one number');
                }
            },
            private: true, // used by the toJSON plugin
        },
        role: {
            type: String,
            enum: roles,
            required: [true, 'User must have a role!']
        },
        favorites:{
            type:Map,
            of:Boolean,
            default:{}
        },
        picture:{
            type:mongoose.SchemaTypes.ObjectId,
            ref:'File'
        }
    },
    {
        toJSON:{virtuals:true},
    toObject:{virtuals:true},
        timestamps: true
    }
);

userSchema.virtual('evaluations', {
    ref: 'Evaluation',
    localField: '_id',
    foreignField: 'evaluatedBy',
});


// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);


userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({email, _id: {$ne: excludeUserId}});
    return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
