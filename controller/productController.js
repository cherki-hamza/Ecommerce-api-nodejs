/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a Product controller
*/

const path = require('path');
var fs = require('fs');
const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');
require('colors');
const ApiFeatures = require('../utils/apiFeatures');
const factory = require('./handlers/handlersFactory');
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
var watermark = require('image-watermark');
const { mkdir } = require('../helpers/helper');
const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');



// upload images    
exports.uploasProductImages = uploadMixOfImages([
    {
        name: 'imageCover',
        maxCount: 1
    },
    {
       name: 'images',
        maxCount: 10
    }
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {

    

    //1 proccessing the image cover
    if (req.files.imageCover) {
        const imageCoverFilename = `product-cover-${uuidv4()}-${Date.now()}-cover.jpeg`;

        // check if there is a directory if not create it
        mkdir('products');
   
        // resize image
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1400)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageCoverFilename}`);
        // add imageCover filename to request body
        req.body.imageCover = imageCoverFilename;
    }// end off proccessing image cover

    // 2 images proccessing for the images
    if (req.files.images) {
        req.body.images = [];
        // check if there is a directory if not create it
        mkdir('products');

       await Promise.all(
            req.files.images.map(async (img, index) => {

                const imageName = `product-image-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
                await sharp(img.buffer)
                    .resize(600, 800)
                    .toFormat('jpeg')
                    .jpeg({ quality: 95 })
                    .toFile(`uploads/products/${imageName}`);
                // add imageCover filename to request body
                req.body.images.push(imageName);
            
            })
        );

        

    }  //end of images proccessing

    next();

});



// @desc    Create new product
// @route   Post /api/v1/Products
// @access  Private
exports.createProduct = factory.createOne(Product); 


// @desc    Get List of  Products with pagination
// @route   Get /api/v1/products
// @access  Public
exports.getProducts = factory.getAll(Product , 'Products');


// @desc    Get specific product by id
// @route   Get /api/v1/products/:id
// @access  Public
exports.getProductbyId = factory.getOne(Product);


// @desc    Update product by id
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProductbyId = factory.updateOne(Product , 'products');


// @desc    delete product by id
// @route   Delete /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(Product, 'products');