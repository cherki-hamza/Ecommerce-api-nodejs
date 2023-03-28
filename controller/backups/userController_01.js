/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a user controller
*/

const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');
const User = require('../models/userModel');


// method for get user
const geteUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ApiError(`Oops this user not exist here !!`, 500));
    }

    const { password, ...result } = user._doc;
    res.status(200).json({ data: result });

});

// method for get all users with pagination 10 pare page
const gettAllUsers = asyncHandler(async (req, res) => {

    const page = req.query.page * 1 || 1;
    const limit = req.query.page * 1 || 10;
    const skip = ((page - 1) * limit);

    const users = await User.find({}).skip(skip).limit(limit);
    res.status(201).json({ result: users.length, page, data: users });

});

// method for update user by verification token and authorization
const updateUser = asyncHandler(async (req, res) => {

    if (req.body.password) {
        req.body.password = bcrypt.AES.encrypt(
            req.body.password,
            process.env.SECRET_KEY
        ).toString();
    }

    const userUpdated = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, { new: true })

    if (!userUpdated) {
        return next(new ApiError(`Oops The User  not be updated`, 404));
    }
    res.status(200).json({ data: userUpdated });

});


// method for delete user
const deleteUser = asyncHandler(async (req, res) => {

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
        return next(new ApiError(`Oops The User  not be updated`, 500));
    }

    res.status(200).json(`User has been deleted...`);

});


module.exports = { geteUser, gettAllUsers, updateUser, deleteUser };