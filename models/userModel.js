/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is the user Model & Shema to define the database
*/

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// 1- create Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'Username required'],
        unique: [true, 'Username must be unique'],
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Email required'],
        unique: [true, 'Email must be unique'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Too short password'],
    },
    passwordChangeAt: {
        type: Date,
    },
    passwordResetCode: {
        type: String,
    },
     passwordResetExpires: {
        type: Date,
    },
     passwordResetVerified : {
        type: Boolean,
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'manager'],
        default: 'user'
    },
    slug: {
        type: String,
        lowercase: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    profileImg: {
        type: String,
        default: null,
    },
}, { timestamps: true });

userSchema.pre('save', async function(next) {

    if (!this.isModified('password')) return next();
    // hash password
    this.password = await bcrypt.hash(this.password, 12);

    next();

});



// 2- create model
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;