/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a subCategory controller
*/

const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');
const SubCategory = require('../models/subCategoryModel');


// middleware for set request category body
const setCategoryIdBody = (req, res, next) => {

    // Nested Route
    if (!req.body.category) req.body.category = req.params.categoryId;

    next();

};

// @desc    Create new subCategory
// @route   Post /api/v1/subcategories
// @access  Private
const createsubCategory = asyncHandler(async (req, res) => {

    const { name, category } = req.body;
    const subcategory = await SubCategory.create({
        name,
        slug: slugify(name),
        category,
    });
    res.status(201).json({ data: subcategory });

});


// middleware for add fillter to query 
const createFilterObject = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId };
    req.filterObJ = filterObject;

    next();
}

// @desc    Get List of  categories with pagination
// @route   Get /api/v1/categories
// @access  Public
const getsubCategories = asyncHandler(async (req, res) => {

    const page = req.query.page * 1 || 1;
    const limit = req.query.page * 1 || 10;
    const skip = ((page - 1) * limit);



    const subcategories = await SubCategory.find(req.filterObJ).skip(skip).limit(limit)
        .populate({ path: 'category', select: 'name slug -_id' }); // .populate('category') ==> get all subcategory with all infos
    res.status(201).json({ result: subcategories.length, page, data: subcategories });

});


// @desc    Get specific subcategory by id
// @route   Get /api/v1/subcategories/:id
// @access  Public
const getsubCategorybyId = asyncHandler(async (req, res, next) => {

    //const id = req.params.id or
    const id = req.params.id;
    const subcategory_by_id = await SubCategory.findById(id).populate({ path: 'category', select: 'name slug -_id' });

    if (!subcategory_by_id) {
        //res.status(404).json({ msg: `Oops No subCategory for this id ${id} ` });
        return next(new ApiError(`Oops No subCategory for this id ${id} `, 404));
    }
    res.status(200).json({ data: subcategory_by_id });

});


// @desc    Update subcategories by id
// @route   PUT /api/v1/subcategories/:id
// @access  Private
const updatesubCategorybyId = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const { name, category } = req.body;

    const subcategory = await SubCategory.findByIdAndUpdate(
        { _id: id }, // from params
        { name, slug: slugify(name), category },  // from body
        { new: true } // return by new subcategories name update
    );

    if (!subcategory) {
        //res.status(404).json({ msg: `Oops The subcategories by id  ${name} not be updated` });
        return next(new ApiError(`Oops The subcategories by id  ${id} not be updated`, 404));
    }
    res.status(200).json({ data: subcategory });

});


// @desc    delete subcategories by id
// @route   Delete /api/v1/subcategories/:id
// @access  Private
const deletesubCategory = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const deleted_subcategory = await SubCategory.findByIdAndDelete(id);

    if (!deleted_subcategory) {
        // res.status(404).json({ msg: `Oops No subcategories for this ${id} to be deleted` });
        return next(new ApiError(`Oops No subcategories for this ${id} to be deleted`, 404));
    }
    res.status(204).send();

});

module.exports = { createsubCategory, getsubCategorybyId, getsubCategories, updatesubCategorybyId, deletesubCategory, setCategoryIdBody, createFilterObject };