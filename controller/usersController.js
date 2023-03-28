/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a users controller
*/

const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const factory = require('./handlers/handlersFactory');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { mkdir, removeFile } = require('../helpers/helper');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const User = require('../models/userModel');
const  createToken  = require('../utils/createToken');



// upload single image
exports.uploadUserImage = uploadSingleImage('profileImg');
// Image proceccing resize image
exports.resizeImage = asyncHandler(async (req, res, next) => {
  
  const filename = `user-${uuidv4()}-${Date.now()}.png`; 
  
  // check if there is a directory if not create it
  mkdir('users');
  
  // check if there is image for user
  if (req.file) {
     // resize image
    await sharp(req.file.buffer)
      .resize(200,200)
      .toFormat('png')
      .png({ quality: 95 })
      .toFile(`uploads/users/${filename}`);
    // add image filename to request body
    req.body.profileImg = filename;
  }
   

   next();
});


// @desc    Create new user
// @route   Post /api/v1/users
// @access  Private
exports.createUser = factory.createOne(User);


// @desc    Get List of  users with pagination
// @route   Get /api/v1/users
// @access  Private
exports.getusers = factory.getAll(User);


// @desc    Get specific user by id
// @route   Get /api/v1/users/:id
// @access  Private
exports.getUser = factory.getOne(User);


// @desc    Update user by id
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUserbyId =  asyncHandler(async (req, res, next) => {
   
    let document;
    const id = req.params.id;
    const get_image = await User.findById(id);
   
    // remove image from upload/../..name.png  and update
    if (req.body.profileImg) {
        
        removeFile('users', get_image.profileImg);
         document = await User.findByIdAndUpdate(
            req.params.id,
            {
              username: req.body.username,
              slug: req.body.slug,
              phone: req.body.phone,
              email: req.body.email,
              username: req.body.username,
              profileImg: req.body.profileImg, 
              role: req.body.role
            },
            { new: true } // return by new brand name update
        );

    } else {
         // update without any image
        document = await User.findByIdAndUpdate(
                    req.params.id,
                    {
                      username: req.body.username,
                      slug: req.body.slug,
                      phone: req.body.phone,
                      email: req.body.email,
                      username: req.body.username,
                      role: req.body.role
                    },
                    { new: true } // return by new brand name update
        ); // end update without any image
    }

   

    if (!document) {
        return next(new ApiError(`Oops The document by id  ${id} not be updated`, 404));
    }
    res.status(200).json({ /* result:'The image updated with success' , */ data: document });

});

// Methode for change password 
exports.changeUserPassword = asyncHandler(async (req, res, next) => {

 let  document = await User.findByIdAndUpdate(
            req.params.id,
            {
              password: await bcrypt.hash(req.body.password, 12),
              passwordChangeAt: Date.now(),
            },
            { new: true } // return by new brand name update
  );
  if (!document) {
        return next(new ApiError(`Oops The document by id  ${req.params.id} not be updated`, 404));
  }   
  
  res.status(200).json({  data: document });
});



// @desc    delete user by id
// @route   Delete /api/v1/users/:id
// @access  Private
exports.deleteUser = factory.deleteOne(User, 'users');

// Activate user status
exports.ActivateUserStatus = asyncHandler(async (req,res,next) => {
  id = req.params.id;
  document = await User.findByIdAndUpdate(
    req.params.id,
    {active: true},
    { new: true }
  );

  if (!document) {
        return next(new ApiError(`Oops The document by id  ${req.params.id} not be updated`, 404));
    }
    res.status(200).json({ data: document });
                    
});

// Deactivate user status
exports.DactivateUserStatus = asyncHandler(async (req,res,next) => {

  document = await User.findByIdAndUpdate(
     req.params.id,
     {active: false},
    { new: true }
  );

  if (!document) {
        return next(new ApiError(`Oops The document by id  ${req.params.id} not be updated`, 404));
    }
    res.status(200).json({ data: document });
                    
});


// @desc    get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/protected
exports.getLoggedUserData = asyncHandler(async (req, res, next) => { 

  req.params.id = req.user._id;
  next();

});


// @desc    update Logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/protected
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  
  // 1)- update user password and the request id get from logged user
   let  user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now(),
    },
    { new: true } // return by new brand name update
  );

   // 2)- generate token
  let token = createToken(user._id);
  
  res.status(200).json({ data: user, token });
  
   
}); 

// @desc    update Logged user data
// @route   PUT /api/v1/users/updateMyData
// @access  Private/protected
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  
  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    {
       username: req.body.name,
       email: req.body.email,
       phone: req.body.phone,
    },
    { new: true } // return by new brand name update
  );

  //let token = createToken(req.user._id);


  res.status(200).json({ data: updateUser });
  
   
}); 

// @desc    delete Logged user data
// @route   PUT /api/v1/users/updateMyData
// @access  Private/protected
exports.delete_DesactivateLoggedUserData = asyncHandler(async (req, res, next) => {

  await User.findByIdAndUpdate(req.user._id,{ active: false });

  
 res.status(200).json({ status: 'user desactivate with success' });
  
   
}); 

