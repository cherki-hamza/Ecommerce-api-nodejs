/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a router category module 
*/


const express = require('express');
//const { validationResult } = require('express-validator');


const {
    createCategory,
    getCategories,
    getCategorybyId,
    //getCategorybyName,
    updateCategorybyId,
    //updateCategorybyName,
    deleteCategory,
    uploadCategoryImage,
    resizeImage,
    //watermarkImage,
} = require('../controller/categoryController');


const validatorMiddleware = require('../middlewares/validatorMiddleware');

const { getCategoryValidator, createCategoyValidator, updateCategoryValidator, deleteCategoryValidator } = require('../utils/validators/categoryValidator');

const subcategoriesRoute = require('./subCategoryRoute');

const check_auth = require('../controller/auth/authontification');


const router = express.Router();

// method 1 or
/* router.get('/', getCategories);
router.post('/', createCategory); */

// route for nested subcategory itemes ==> get the all subcategory of one category
router.use('/:categoryId/subcategories', subcategoriesRoute);

// .. method 2 : route for create new category and get all category by pagination get & post
router.route('/')
    .get(getCategories)
    .post(
        check_auth.protect,
        check_auth.allowedTo('admin','manager'),
        uploadCategoryImage,
        resizeImage,
        createCategoyValidator,
        createCategory);

// route for get the specific category by name of category
//router.route('/:name').get(getCategorybyName);

// route for get the specific category by id
router.route('/:id')
    .get(getCategoryValidator, getCategorybyId);


// route for update category by name
//router.route('/:cat_name').put(updateCategorybyName);


// route for update category by id

router.route('/:id')
    .put(uploadCategoryImage,resizeImage,updateCategoryValidator, updateCategorybyId);

// route for delete category by id
router.route('/:id')
    .delete(deleteCategoryValidator, deleteCategory);





module.exports = router;