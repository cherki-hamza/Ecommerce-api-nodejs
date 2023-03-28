/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a brand controller
*/

const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');


// @desc    Create new Brand
// @route   Post /api/v1/brands
// @access  Private
const createBrand = asyncHandler(async (req, res) => {

    const name = req.body.name;
    const brand = await Brand.create({ name, slug: slugify(name) });
    res.status(201).json({ data: brand });

});

// @desc    Get List of  brands with pagination
// @route   Get /api/v1/brands
// @access  Public
const getAllBrands = asyncHandler(async (req, res) => {

    const page = req.query.page * 1 || 1;
    const limit = req.query.page * 1 || 10;
    const skip = ((page - 1) * limit);

    const brands = await Brand.find({}).skip(skip).limit(limit);
    res.status(201).json({ result: brands.length, page, data: brands });

});


// @desc    Get specific Brand by id
// @route   Get /api/v1/brands/:id
// @access  Public
const getBrandbyId = asyncHandler(async (req, res, next) => {

    //const id = req.params.id or
    const id = req.params.id;
    const brand_by_id = await Brand.findById(id);

    if (!brand_by_id) {
        return next(new ApiError(`Oops No Brand for this id ${id} `, 404));
    }
    res.status(200).json({ data: brand_by_id });

});


// @desc    Get specific Brand by id
// @route   Get /api/v1/brands/:id
// @access  Public
/* exports.getBrandbyName = asyncHandler(async (req, res) => {

    //const id = req.params.id or
    const { name } = req.params;
    const brand_by_name = await Brand.findOne({ name: name });

    if (!brand_by_name) {
        res.status(400).json({ msg: `Oops No Brand for this name ${name} ` });
    }
    res.status(200).json({ data: brand_by_name });

}); */


// @desc    Update Brand by id
// @route   PUT /api/v1/categories/:id
// @access  Private
const updateBrandbyId = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const { name } = req.body;

    const brand = await Brand.findByIdAndUpdate(
        { _id: id }, // from params
        { name, slug: slugify(name) },  // from body
        { new: true } // return by new brand name update
    );

    if (!brand) {
        return next(new ApiError(`Oops The Brand by id  ${id} not be updated`, 404));
    }
    res.status(200).json({ data: brand });

});

// @desc    Update Brand by Brand name
// @route   PUT /api/v1/brands/:id
// @access  Private
/* exports.updateBrandbyName = asyncHandler(async (req, res) => {

    const { cat_name } = req.params;
    const { name } = req.body;
    const brand = await Brand.findOneAndUpdate(
        { name: cat_name },  // from params
        { name: name, slug: slugify(name) }, // from body
        { new: true } // return by new Brand name update
    );

    if (!brand) {
        res.status(404).json({ msg: `Oops The Brand by name  ${name} not be updated` });
    }
    res.status(200).json({ data: brand });

}); */


// @desc    delete Brand by id
// @route   Delete /api/v1/categories/:id
// @access  Private
const deleteBrand = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const deleted_Brand = await Brand.findByIdAndDelete(id);

    if (!deleted_Brand) {
        // res.status(404).json({ msg: `Oops No Brand for this ${id} to be deleted` });
        return next(new ApiError(`Oops No Brand for this ${id} to be deleted`, 404));
    }
    res.status(204).send();

});

module.exports = { createBrand, getAllBrands, getBrandbyId, updateBrandbyId, deleteBrand };