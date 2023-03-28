/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a router product module 
*/


const express = require('express');

const {
    createProduct,
    getProducts,
    getProductbyId,
    updateProductbyId,
    deleteProduct,
    uploasProductImages,
    resizeProductImages,

} = require('../controller/productController');

const validatorMiddleware = require('../middlewares/validatorMiddleware');

const { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } = require('../utils/validators/productValidation');

const check_auth = require('../controller/auth/authontification');

const router = express.Router();



// .. method 2 : route for create new product and get all products by pagination get & post
router.route('/')
    .get(
        check_auth.protect,check_auth.allowedTo('admin','manager'),
        getProducts)
    .post(
        check_auth.protect,check_auth.allowedTo('admin','manager'),
        uploasProductImages, resizeProductImages, createProductValidator, createProduct
    );

// route for get the specific product by title of product
//router.route('/:product_title').get(getProductByTitle);

// route for get the specific category by id
router.route('/:id')
    .get(
        check_auth.protect,check_auth.allowedTo('admin','manager'),
        getProductValidator, getProductbyId
    );


// route for update product by title
//router.route('/:product_title').put(updateProductByTitle);


// route for update product by id
router.route('/:id')
    .put(
        check_auth.protect,check_auth.allowedTo('admin','manager'),
        uploasProductImages, resizeProductImages, updateProductValidator, updateProductbyId
    );

// route for delete product by id
router.route('/:id')
    .delete(
        check_auth.protect,check_auth.allowedTo('admin'),
        deleteProductValidator, deleteProduct
    );





module.exports = router;