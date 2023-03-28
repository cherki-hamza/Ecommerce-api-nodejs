/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a router users module 
*/


const express = require('express');

const { signupValidator, loginValidator } = require('../utils/validators/authValidator');

const { signup, login , forgotPassword, verifyPasswordResetCode, resetPassword } = require('../controller/auth/authontification');

const router = express.Router();



// route for signup
router.route('/signup')
      .post(signupValidator,signup);

// route for login
router.route('/login')
     .post(loginValidator,login);

//forget password
router.post('/forgotPassword', forgotPassword);

// verify password resetCode
router.post('/verifyPassResetCode', verifyPasswordResetCode);

// reset password
router.put('/resetPassword', resetPassword);


module.exports = router;