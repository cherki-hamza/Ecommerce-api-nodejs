/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a router brand module 
*/


const express = require('express');
const multer  = require('multer');

const {
    createBrand,
    getAllBrands,
    getBrandbyId,
    //getBrandbyName,
    updateBrandbyId,
    //updateBrandbyName,
    deleteBrand,
    uploadCategoryImage,
    resizeImage,
} = require('../controller/brandController');

//const upload = multer('uploads/brands');

const validatorMiddleware = require('../middlewares/validatorMiddleware');

const { getBrandValidator, createBrandValidator, updateBrandValidator, deleteBrandValidator } = require('../utils/validators/brandValidator');

const check_auth = require('../controller/auth/authontification');

const router = express.Router();


// .. method 2 : route for create new brand and get all brand by pagination get & post
router.route('/')
    .get(check_auth.protect, check_auth.allowedTo('admin', 'manager')
        , getAllBrands)
    .post(
        check_auth.protect,check_auth.allowedTo('admin','manager'),
        uploadCategoryImage, resizeImage, createBrandValidator, createBrand
    );

// route for get the specific brand by name of brand
//router.route('/:name').get(getBrandbyName);

// route for get the specific brand by id
router.route('/:id')
    .get(
        check_auth.protect,check_auth.allowedTo('admin','manager'),
        getBrandValidator, getBrandbyId
    );


// route for update brand by name
//router.route('/:cat_name').put(updateBrandbyName);


// route for update brand by id
router.route('/:id')
    .put(
        check_auth.protect,check_auth.allowedTo('admin','manager'),
        uploadCategoryImage, resizeImage, updateBrandValidator, updateBrandbyId
    );

// route for delete brand by id
router.route('/:id')
    .delete(
        check_auth.protect,check_auth.allowedTo('admin'),
        deleteBrandValidator, deleteBrand
    );



module.exports = router;