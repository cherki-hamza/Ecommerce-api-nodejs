/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a auth router module 
*/


const express = require('express');
const router = express.Router();
const { register, login } = require('../controller/auth/auth');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAuthorizationAndIsAdmin } = require('../middlewares/verifyToken');
const { geteUser, gettAllUsers, updateUser, deleteUser } = require('../controller/userController');


// Register
router.route('/register').post(register);
// Login
router.route('/login').get(login);

// get the user
router.route('/:id').get(verifyTokenAndAuthorization, geteUser);

// get all users
router.get('/', /* verifyTokenAndAuthorization */ gettAllUsers);

// verification user and authorization and update user by id
router.put('/:id', verifyTokenAndAuthorization, updateUser);

// verificationuser and authorization and delete the user by id
router.delete('/:id', verifyTokenAndAuthorization, deleteUser);



module.exports = router;