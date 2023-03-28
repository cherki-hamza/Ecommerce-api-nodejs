/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a router users module 
*/


const express = require('express');

const {
    createUser,
    getusers,
    getUser,
    //getCategorybyName,
    updateUserbyId,
    //updateCategorybyName,
    deleteUser,
    uploadUserImage,
    resizeImage,
    //watermarkImage,
    ActivateUserStatus,
    DactivateUserStatus,
    changeUserPassword,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    delete_DesactivateLoggedUserData,
} = require('../controller/usersController');


const validatorMiddleware = require('../middlewares/validatorMiddleware');

const {
    createUserValidator,
    getUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
    updateLggedUserValidator,
} = require('../utils/validators/userValidator');

const check_auth = require('../controller/auth/authontification');

const router = express.Router();


// route for get the logged user : get me
router.get('/getMe', check_auth.protect, getLoggedUserData, getUser);
// route for update and change password based logged user
router.put('/changeMyPassword', check_auth.protect, updateLoggedUserPassword);
// route for update Logged user data
router.put('/updateMe', check_auth.protect,updateLggedUserValidator, updateLoggedUserData);

// delete and desactivate logged user data
router.delete('/deleteMe', check_auth.protect, delete_DesactivateLoggedUserData);




// .. method 2 : route for create new user and get all users by pagination get & post
router.route('/')
    .get(
        check_auth.protect,
        check_auth.allowedTo('admin','manager'),
        getusers
    )
    .post(
        check_auth.protect,
        check_auth.allowedTo('admin'),
        uploadUserImage,
        resizeImage,
        createUserValidator,
        createUser
    );


// route for get the specific user by id
router.route('/:id')
    .get(
        check_auth.protect,
        check_auth.allowedTo('admin'),
        getUserValidator,
        getUser
    );


// route for update user by name
//router.route('/:user_name').put(updateUserbyName);


// route for update user by id

router.route('/:id').put(
         check_auth.protect, check_auth.allowedTo('admin'),
         uploadUserImage, resizeImage, updateUserValidator, updateUserbyId
);

// route for delete category by id
router.route('/:id').delete(
    check_auth.protect, check_auth.allowedTo('admin'),
    deleteUserValidator, deleteUser
);

// activate user status to true
router.route('/:id/activate').put(check_auth.protect, check_auth.allowedTo('admin'),ActivateUserStatus);
// desactivate user status tu false
router.route('/:id/deactivate').put(check_auth.protect, check_auth.allowedTo('admin'),DactivateUserStatus);

// change user password
router.route('/changePassword/:id').put(
    check_auth.protect, check_auth.allowedTo('admin'),
    changeUserPasswordValidator, changeUserPassword
);

module.exports = router;