/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a Authontification module
*/

const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const User = require('../../models/userModel');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ApiError = require('../../utils/apiError');
const sendEmail = require('../../utils/sendEmail');


// function to create token
const createToken = (payload) => 
    
     jwt.sign({ userId: payload }, `${process.env.JWT_SECRET_KEY}`, {
        expiresIn: process.env.JWT_EXPIRE_TIME
})

// @desc    signup method
// @route   Get /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {

    // 1- create new user
    const user = await User.create({
         username: req.body.username,
         email: req.body.email,
         password: req.body.password,
     });

    // 2- Generate token
    /* const token = jwt.sign({ userId: user._id }, `${process.env.JWT_SECRET_KEY}`, {
        expiresIn: process.env.JWT_EXPIRE_TIME
    }); */
    const token = createToken(user._id);

    res.status(201).json({data: user, token});

});


// @desc    login method
// @route   Get /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {

    // 1- check if password and email in the body (validation)

    // 2- check if userexist & check if password is correct
    const user = await User.findOne({ email: req.body.email });
    
    if (!user ||  !(await  bcrypt.compare(req.body.password, user.password))) {
         return next(new ApiError('Incorrect email or password' , 401));
    }
    // 3- generate token
     /* const token = jwt.sign({ userId: user._id }, `${process.env.JWT_SECRET_KEY}`, {
        expiresIn: process.env.JWT_EXPIRE_TIME
    }); */
    const token = createToken(user._id);
 

    // 4- send response to client side
    res.status(200).json({data: user, token});

});

// methode for protect not login user && not autorize user && not accepted token
// make sure if user logged in and token accepted 

exports.protect = asyncHandler(async (req, res, next) => {

    // 1- check if token exists, if exist get
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

         token = req.headers.authorization.split(' ')[1];

    } 
    if (!token) {
        return next(new ApiError('You Are Not Login And Not authorized to access this route', 401));
    }

    // 2- verify token (no change happens, expired token)
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);

    // 3- check if user exists
    const currentuser = await User.findById(decoded.userId);
    if (!currentuser) {
        return next(new ApiError('The user that belongs to this token does no longer exist', 401));
    }
    
    // 4- check if user change his password after token created
    if (currentuser.passwordChangeAt) {

        const passwordChangeTimestamp = parseInt(currentuser.passwordChangeAt.getTime() / 1000,10);
           
        if (passwordChangeTimestamp > decoded.iat) {

            return next(new ApiError('Your password has been changed recently please login again...', 401));
        }
        
    }
    
       req.user = currentuser;

       next();
    


});


// method for allow user by role
exports.allowedTo = (...roles) => asyncHandler(async (req, res, next) => {

    // 1)- access roles
    // 2)- access registred user (req.user.role)
    if (!roles.includes(req.user.role)) {
        return next(new ApiError('You are not allowed to access this route', 403));
    }

    next();
    
}); 

// rest password : forget password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    
    // 1)- get user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`There is no user with this email ${req.body.email}`, 404));
    }

    // 2)- check if user exist , Generate and hash random 6 digitsand save it in db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');
    
    // save hashed password reset code in db
    user.passwordResetCode = hashedResetCode;
    // Add expiration time for password reset code +(10 minutes)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;

    await user.save();
    
    let message = `
        Hi ${user.email} ,\n\n
        We received a request to reset your password on your E-shop .\n\n
        ${resetCode} \n
        Enter this code to reset your password on your E-shop.\n\n
        Thanks for helping us keep your E-shop account secure.\n\n
        The E-shop team .. \n\n
        `;

    // 3)- Send the reset code via email
    try {

        await sendEmail({
            email: user.email,
            subject: 'Your Password Reset Code (valid for 10 minutes)',
            message
        });
        
    } catch (error) {

        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save();

        return next(new ApiError('There is an error in sending email', 500));
        
    }
    

    res.status(200).json({
        status:'success',
        data: {
            message: 'Password reset code sent to your email'
        }
    })
    

});

// verify password reset code
exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {

    // 1)- get user based on password reset code
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(req.body.resetCode)
        .digest('hex');

    const user = await User.findOne({ 
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
        return next(new ApiError('Invalid password reset code Or Expired', 400));
    }

    // 2)- reset code is valid
    user.passwordResetVerified = true;
    await user.save();
    
    res.status(200).json({
        status: 'success',
    });
    

});


// reset password
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // get user based on email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`There is no user with this email ${req.body.email}`, 404));
    }

    // check if reset code is verified
    if (!user.passwordResetVerified) {
        return next(new ApiError('Reset code note verified', 400));
    }

    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    
    // 3)- if evry thinks ok generate new token
    let token = createToken(user._id);
    res.status(200).json({ token });


});
