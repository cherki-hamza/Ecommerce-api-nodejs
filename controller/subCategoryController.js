/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a subCategory controller
*/

const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');
const SubCategory = require('../models/subCategoryModel');
const ApiFeatures = require('../utils/apiFeatures');
const factory = require('./handlers/handlersFactory');


// middleware for set request category body
const setCategoryIdBody = (req, res, next) => {

    // Nested Route
    if (!req.body.category) req.body.category = req.params.categoryId;

    next();

};

// @desc    Create new subCategory
// @route   Post /api/v1/subcategories
// @access  Private

const createsubCategory = factory.createOne(SubCategory);

/* const createsubCategory = asyncHandler(async (req, res) => {

    const { name, category } = req.body;
    const subcategory = await SubCategory.create({
        name,
        slug: slugify(name),
        category,
    });
    res.status(201).json({ data: subcategory });

}); */


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

const getsubCategories = factory.getAll(SubCategory);

/* const getsubCategories = asyncHandler(async (req, res) => {

     //3  build query
     const documentsCount = await SubCategory.countDocuments();
     const api_features = new ApiFeatures(SubCategory.find(),req.query)
                                        .paginate(documentsCount).filter().search()
                                        .limitFields().sort();
                                        // .populate({path:'category',select:'name'})
                                        //.populate({path:'subcategory',select:'name'}); 
 
     // execute query
     const {mongooseQuery , paginationResult} = api_features;                                   
     const subcategories = await api_features.mongooseQuery;



    // const subcategories = await SubCategory.find(req.filterObJ).skip(skip).limit(limit)
      //  .populate({ path: 'category', select: 'name slug -_id' }); // .populate('category') ==> get all subcategory with all infos 


    res.status(201).json({ result: subcategories.length, paginationResult, data: subcategories });

}); */


// @desc    Get specific subcategory by id
// @route   Get /api/v1/subcategories/:id
// @access  Public

const getsubCategorybyId = factory.getOne();

/* const getsubCategorybyId = asyncHandler(async (req, res, next) => {

    //const id = req.params.id or
    const id = req.params.id;
    const subcategory_by_id = await SubCategory.findById(id).populate({ path: 'category', select: 'name slug -_id' });

    if (!subcategory_by_id) {
        //res.status(404).json({ msg: `Oops No subCategory for this id ${id} ` });
        return next(new ApiError(`Oops No subCategory for this id ${id} `, 404));
    }
    res.status(200).json({ data: subcategory_by_id });

}); */


// @desc    Update subcategories by id
// @route   PUT /api/v1/subcategories/:id
// @access  Private

const updatesubCategorybyId = factory.updateOne(SubCategory);
/* const updatesubCategorybyId = asyncHandler(async (req, res, next) => {

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

}); */


// @desc    delete subcategories by id
// @route   Delete /api/v1/subcategories/:id
// @access  Private

const deletesubCategory = factory.deleteOne(SubCategory);

/* const deletesubCategory = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const deleted_subcategory = await SubCategory.findByIdAndDelete(id);

    if (!deleted_subcategory) {
        // res.status(404).json({ msg: `Oops No subcategories for this ${id} to be deleted` });
        return next(new ApiError(`Oops No subcategories for this ${id} to be deleted`, 404));
    }
    res.status(204).send();

}); */

module.exports = { createsubCategory, getsubCategorybyId, getsubCategories, updatesubCategorybyId, deletesubCategory, setCategoryIdBody, createFilterObject };