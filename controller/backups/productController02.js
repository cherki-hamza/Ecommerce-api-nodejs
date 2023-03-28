/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a Product controller
*/

const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');
require('colors');
const ApiFeatures = require('../utils/apiFeatures');
const factory = require('./handlers/handlersFactory');



// @desc    Create new product
// @route   Post /api/v1/Products
// @access  Private

exports.createProduct = factory.createOne(Product); 

/* exports.createProduct = asyncHandler(async (req, res) => {

    req.body.slug = slugify(req.body.title);
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });

}); */

// @desc    Get List of  Products with pagination
// @route   Get /api/v1/products
// @access  Public

exports.getProducts = factory.getAll(Product , 'Products');

/* exports.getProducts = asyncHandler(async (req, res) => {

    //3  build query
    const documentsCount = await Product.countDocuments();
    const api_features = new ApiFeatures(Product.find(),req.query)
                                       .paginate(documentsCount).filter().search('Products')
                                       .limitFields().sort();
                                      // .populate({path:'category',select:'name'})
                                      //.populate({path:'subcategory',select:'name'}); 

    // execute query
    const {mongooseQuery , paginationResult} = api_features;                                   
    const products = await api_features.mongooseQuery;                                   
    
    res.status(201).json({ result: products.length, paginationResult, data: products });

}); */


// @desc    Get specific product by id
// @route   Get /api/v1/products/:id
// @access  Public

exports.getProductbyId = factory.getOne(Product);

/* exports.getProductbyId = asyncHandler(async (req, res, next) => {

    //const id = req.params.id or
    const { id } = req.params;
    const product_by_id = await Product.findById(id) 
                                .populate({path:'category',select:'name'});

    if (!product_by_id) {
        //res.status(404).json({ msg: `Oops No Category for this id ${id} ` });
        return next(new ApiError(`Oops No Product for this id ${id} `, 404));
    }
    res.status(201).json({ data: product_by_id });

}); */


// @desc    Get specific product by titlt or any specific field
// @route   Get /api/v1/products/:id
// @access  Public
/* exports.getProductByTitle = asyncHandler(async (req, res) => {

    //const id = req.params.id or
    const { title } = req.params;
    const product_by_title = await Category.findOne({ title: title });

    if (!product_by_title) {
        res.status(400).json({ msg: `Oops No product for this title ${title} ` });
    }
    res.status(200).json({ data: product_by_title });

}); */


// @desc    Update product by id
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProductbyId = factory.updateOne(Product);

/* exports.updateProductbyId = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    
    if(req.body.title)
    {
        req.body.slug = slugify(req.body.title);
    }

    const product = await Product.findByIdAndUpdate(
        { _id: id }, // from params
        req.body,  // from body
        { new: true } // return by new product name update
    );

    if (!product) {
        //res.status(404).json({ msg: `Oops The product by id  ${name} not be updated` });
        return next(new ApiError(`Oops The product by id  ${id} not be updated`, 404));
    }
    res.status(200).json({ data: product });

}); */

// @desc    Update product by product title
// @route   PUT /api/v1/products/:title
// @access  Private
/* exports.updateProductByTitle = asyncHandler(async (req, res) => {

    const { product_name } = req.params;
    const { title } = req.body;
    const product = await Product.findOneAndUpdate(
        { title: product_name },  // from params
        { title: title, slug: slugify(title) }, // from body
        { new: true } // return by new product name update
    );

    if (!product) {
        res.status(404).json({ msg: `Oops The product by name  ${title} not be updated` });
    }
    res.status(200).json({ data: product });

}); */


// @desc    delete product by id
// @route   Delete /api/v1/products/:id
// @access  Private

exports.deleteProduct = factory.deleteOne(Product);

/* exports.deleteProduct = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const deleted_product = await Product.findByIdAndDelete(id);

    if (!deleted_product) {
        // res.status(404).json({ msg: `Oops No Category for this ${id} to be deleted` });
        return next(new ApiError(`Oops No Product for this ${id} to be deleted`, 404));
    } // for statue = 204 return no message just status
    res.status(200).json({message:`the product deleted with success`});

}); */