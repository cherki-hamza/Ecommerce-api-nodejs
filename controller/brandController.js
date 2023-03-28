/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a brand controller
*/


const path = require('path');
var fs = require('fs');
const Brand = require('../models/brandModel');
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
const uploadCategoryImage = uploadSingleImage('image');
// Image proceccing resize image
const resizeImage = asyncHandler(async (req, res, next) => {
  
  const filename = `category-${uuidv4()}-${Date.now()}.png`; 
  
  /* const filename = `category-${uuidv4()}.png`; */

  // check if there is a directory if not create it
  mkdir('brands');
   
    if(req.file){
      // resize image
      await sharp(req.file.buffer)
        .resize(400,600)
        .toFormat('png')
        .png({ quality: 90 })
        .toFile(`uploads/brands/${filename}`);
      // add image filename to request body
        req.body.image = filename;
    }

   next();
});

// watermark image add text to image 
const watermarkImage = asyncHandler(async (req, res, next) => {

 /*  const filename = `category-${uuidv4()}-${Date.now()}.png`;
  let publicPath = path.join(__dirname, `uploads/categories/${filename}`);
  watermark.embedWatermark(req.body.image, { 'text': 'sample watermark' , 'dstPath' : `/uploads/categories/${filename}` });
  next(); */

  /* watermark.embedWatermark(dir+`${filename}`, { 'text': 'sample watermark' , 'dstPath' : dir+`${filename}` });
  console.log(path.join(__dirname, 'uploads/categories'));
  next(); */

});

// @desc    Create new Brand
// @route   Post /api/v1/brands
// @access  Private
const createBrand = factory.createOne(Brand);



// @desc    Get List of  brands with pagination
// @route   Get /api/v1/brands
// @access  Public
const getAllBrands = factory.getAll(Brand);


// @desc    Get specific Brand by id
// @route   Get /api/v1/brands/:id
// @access  Public
const getBrandbyId = factory.getOne(Brand);


// @desc    Update Brand by id
// @route   PUT /api/v1/categories/:id
// @access  Private
const updateBrandbyId = factory.updateOne(Brand,'brands');




// @desc    delete Brand by id
// @route   Delete /api/v1/categories/:id
// @access  Private
const deleteBrand = factory.deleteOne(Brand,'brands');


module.exports = { createBrand, getAllBrands, getBrandbyId, updateBrandbyId, deleteBrand,uploadCategoryImage,resizeImage, watermarkImage };