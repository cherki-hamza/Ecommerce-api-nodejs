/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a router subcategory module 
*/


const express = require('express');

const { createsubCategory, getsubCategorybyId, getsubCategories, updatesubCategorybyId, deletesubCategory, setCategoryIdBody, createFilterObject } = require('../controller/subCategoryController');

const { createSubCategoyValidator, getsubCategoryValidator, updatesubCategoryValidator, deletesubCategoryValidator } = require('../utils/validators/subCategoryValidator');

const check_auth = require('../controller/auth/authontification');

// mergeParams : Allow us to access parameters on 
const router = express.Router({ mergeParams: true });


// route post for create new  subcategories  && route get for get all subcategories
router.route("/")
    .get(
        check_auth.protect,check_auth.allowedTo('admin','manager'),
        createFilterObject, getsubCategories
    )
    .post(
        check_auth.protect,check_auth.allowedTo('admin'),
        setCategoryIdBody, createSubCategoyValidator, createsubCategory
    );

router.route("/:id").get(
    check_auth.protect,check_auth.allowedTo('admin','manager'),
    getsubCategoryValidator, getsubCategorybyId
     )
    .put(
        check_auth.protect,check_auth.allowedTo('admin'),
        updatesubCategoryValidator, updatesubCategorybyId
    )
    .delete(
        check_auth.protect,check_auth.allowedTo('admin'),
        deletesubCategoryValidator, deletesubCategory
    );

module.exports = router;

