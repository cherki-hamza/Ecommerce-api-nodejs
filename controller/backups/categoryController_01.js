/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a category controller
*/

const Category = require('../models/categoryModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');


// @desc    Create new category
// @route   Post /api/v1/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res) => {

    const name = req.body.name;
    const category = await Category.create({ name, slug: slugify(name) });
    res.status(201).json({ data: category });

});

// @desc    Get List of  categories with pagination
// @route   Get /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {

    const page = req.query.page * 1 || 1;
    const limit = req.query.page * 1 || 10;
    const skip = ((page - 1) * limit);

    const categories = await Category.find({}).skip(skip).limit(limit);
    res.status(201).json({ result: categories.length, page, data: categories });

});


// @desc    Get specific category by id
// @route   Get /api/v1/categories/:id
// @access  Public
exports.getCategorybyId = asyncHandler(async (req, res, next) => {

    //const id = req.params.id or
    const id = req.params.id;
    const category_by_id = await Category.findById(id);

    if (!category_by_id) {
        //res.status(404).json({ msg: `Oops No Category for this id ${id} ` });
        return next(new ApiError(`Oops No Category for this id ${id} `, 404));
    }
    res.status(200).json({ data: category_by_id });

});


// @desc    Get specific category by id
// @route   Get /api/v1/categories/:id
// @access  Public
/* exports.getCategorybyName = asyncHandler(async (req, res) => {

    //const id = req.params.id or
    const { name } = req.params;
    const category_by_name = await Category.findOne({ name: name });

    if (!category_by_name) {
        res.status(400).json({ msg: `Oops No Category for this name ${name} ` });
    }
    res.status(200).json({ data: category_by_name });

}); */


// @desc    Update category by id
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategorybyId = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByIdAndUpdate(
        { _id: id }, // from params
        { name, slug: slugify(name) },  // from body
        { new: true } // return by new category name update
    );

    if (!category) {
        //res.status(404).json({ msg: `Oops The Category by id  ${name} not be updated` });
        return next(new ApiError(`Oops The Category by id  ${id} not be updated`, 404));
    }
    res.status(200).json({ data: category });

});

// @desc    Update category by category name
// @route   PUT /api/v1/categories/:id
// @access  Private
/* exports.updateCategorybyName = asyncHandler(async (req, res) => {

    const { cat_name } = req.params;
    const { name } = req.body;
    const category = await Category.findOneAndUpdate(
        { name: cat_name },  // from params
        { name: name, slug: slugify(name) }, // from body
        { new: true } // return by new category name update
    );

    if (!category) {
        res.status(404).json({ msg: `Oops The Category by name  ${name} not be updated` });
    }
    res.status(200).json({ data: category });

}); */


// @desc    delete category by id
// @route   Delete /api/v1/categories/:id
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const deleted_category = await Category.findByIdAndDelete(id);

    if (!deleted_category) {
        // res.status(404).json({ msg: `Oops No Category for this ${id} to be deleted` });
        return next(new ApiError(`Oops No Category for this ${id} to be deleted`, 404));
    }
    res.status(204).send();

});













 // syntax 1 promise
/*  Category.create({ name, slug: slugify(name) })
     .then((category) => {
         res.status(201).json({ data: category });
     })
     .catch((err) => {
         res.status(400).send(err);
     }); */

 // syntax 2  async and await with try and catch
/*  try {
    const category = await Category.create({ name, slug: slugify(name) });
    res.status(201).json({ data: category });
} catch (error) {
    res.status(400).send(error);
}    */