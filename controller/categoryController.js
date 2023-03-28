/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a category controller
*/

const path = require('path');
var fs = require('fs');
const Category = require('../models/categoryModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const factory = require('./handlers/handlersFactory');
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
var watermark = require('image-watermark');
const { mkdir } = require('../helpers/helper');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');


// upload single image
exports.uploadCategoryImage = uploadSingleImage('image');
// Image proceccing resize image
exports.resizeImage = asyncHandler(async (req, res, next) => {
  
  const filename = `category-${uuidv4()}-${Date.now()}.png`; 
  
  /* const filename = `category-${uuidv4()}.png`; */

  // check if there is a directory if not create it
  mkdir('categories');
   
  if (req.file) {
    // resize image
    await sharp(req.file.buffer)
      .resize(400, 600)
      .toFormat('png')
      .png({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);
    // add image filename to request body
    req.body.image = filename;
  }

   next();
});

// watermark image add text to image 
exports.watermarkImage = asyncHandler(async (req, res, next) => {

 /*  const filename = `category-${uuidv4()}-${Date.now()}.png`;
  let publicPath = path.join(__dirname, `uploads/categories/${filename}`);
  watermark.embedWatermark(req.body.image, { 'text': 'sample watermark' , 'dstPath' : `/uploads/categories/${filename}` });
  next(); */

  /* watermark.embedWatermark(dir+`${filename}`, { 'text': 'sample watermark' , 'dstPath' : dir+`${filename}` });
  console.log(path.join(__dirname, 'uploads/categories'));
  next(); */

});



// @desc    Create new category
// @route   Post /api/v1/categories
// @access  Private
exports.createCategory = factory.createOne(Category);


// @desc    Get List of  categories with pagination
// @route   Get /api/v1/categories
// @access  Public
exports.getCategories = factory.getAll(Category);


// @desc    Get specific category by id
// @route   Get /api/v1/categories/:id
// @access  Public
exports.getCategorybyId = factory.getOne(Category);


// @desc    Update category by id
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategorybyId = factory.updateOne(Category,'categories');


// @desc    delete category by id
// @route   Delete /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(Category,'categories');