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


// @desc    Create new product
// @route   Post /api/v1/Products
// @access  Private
exports.createProduct = asyncHandler(async (req, res) => {

    req.body.slug = slugify(req.body.title);
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });

});

// @desc    Get List of  Products with pagination
// @route   Get /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {

    // 1) filtring
    // remove the reserved props in query requests 
    const queryStringObj = {...req.query};
    const excludesFields = ["page","sort","limit","fields"];
    excludesFields.forEach((field)=> delete  queryStringObj[field]);

    // Apply filtration using [gte,gt,lte,lt]
    // {price: {$gte: 50} , ratingAverage: {$gte: 4} }
    // link example ==> http://localhost:8000/api/v1/products?ratingAverage[lte]=4&price[gte]=100
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    /* console.log(queryStringObj);
    console.log(JSON.parse(queryStr)); */

    //2  pagination  
    const page = req.query.page * 1 || 1;
    const limit = req.query.page * 1 || 10;
    const skip = ((page - 1) * limit);

    //3  build query
    let mongooseQuery = Product.find(JSON.parse(queryStr))
                                .skip(skip)
                                .limit(limit)
                                .populate({path:'category',select:'name'})
                                .populate({path:'subcategory',select:'name'});

    // sorting query
    // link example : http://localhost:8000/api/v1/products?sort=price (asending: from -- to ++)
    // link example : http://localhost:8000/api/v1/products?sort=-price (desending: from ++ to --
    if(req.query.sort){
        // example : price, -sold ==> [price, -sold] ==> price -sold
        const sortBy = req.query.sort.split(',').join(' ');
        mongooseQuery = mongooseQuery.sort(sortBy);
    }else{
        mongooseQuery = mongooseQuery.sort('-createAt');
    }

    // fields limiting
    if(req.query.fields){
        // example1 : http://localhost:8000/api/v1/products?fields=title,price,imageCover,sold
        // example1 : http://localhost:8000/api/v1/products?fields=-title,-sold
        const fields = req.query.fields.split(',').join(' ');
        mongooseQuery = mongooseQuery.select(fields);
    }else{
        mongooseQuery = mongooseQuery.select('-__v');
    }



    // search
    if(req.query.keyword){
         // example1 : http://localhost:8000/api/v1/products?keyword=men or women or any text...
         // example 2 http://localhost:8000/api/v1/products?keyword=slightly&fields=title,price
        const query = {};
        query.$or = [
             {title: {$regex: req.query.keyword, $options: "i"} }, // i ==> for lowercase and upercase 
             {description: {$regex: req.query.keyword, $options: "i"} },
        ];
        mongooseQuery = mongooseQuery.find(query);
    }

    //4 execute query
    const products = await mongooseQuery;

    // query ==> {ratingAverage:req.query.ratingAverage,price:req.query.price}
    /* const products = await Product.find(req.query).skip(skip)
                     .limit(limit)
                     .populate({path:'category',select:'name'})
                     .populate({path:'subcategory',select:'name'}); */


    res.status(201).json({ result: products.length, page, data: products });

});


// @desc    Get specific product by id
// @route   Get /api/v1/products/:id
// @access  Public
exports.getProductbyId = asyncHandler(async (req, res, next) => {

    //const id = req.params.id or
    const { id } = req.params;
    const product_by_id = await Product.findById(id) 
                                .populate({path:'category',select:'name'});

    if (!product_by_id) {
        //res.status(404).json({ msg: `Oops No Category for this id ${id} ` });
        return next(new ApiError(`Oops No Product for this id ${id} `, 404));
    }
    res.status(201).json({ data: product_by_id });

});


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
exports.updateProductbyId = asyncHandler(async (req, res, next) => {

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

});

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
exports.deleteProduct = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const deleted_product = await Product.findByIdAndDelete(id);

    if (!deleted_product) {
        // res.status(404).json({ msg: `Oops No Category for this ${id} to be deleted` });
        return next(new ApiError(`Oops No Product for this ${id} to be deleted`, 404));
    } // for statue = 204 return no message just status
    res.status(200).json({message:`the product deleted with success`});

});