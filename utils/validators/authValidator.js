/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a user validator modul
*/

const { check , body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const { default: slugify } = require('slugify');
const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');

exports.signupValidator = [
    check('username').notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('To short User name')
        .custom((val , {req}) => {
            req.body.slug = slugify(val);
            return true;
        }),
    
    check('email').notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalide Email adress')
        .custom(async(val) => {
           await User.findOne ({ email: val }).then((user) => {
                if (user) {
                    //return Promise.reject(new Error('E-mail already in user'));
                   throw new Error('E-mail already in user');
                }
            })
        }),
    
    check('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .custom((password, {req}) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error('Password Confirmation incorect');
            }
            return true;
        }) ,
  

    check('passwordConfirm').notEmpty().withMessage('Password Confirmation required'),

    validatorMiddleware,
];

exports.loginValidator = [
 
    check('email').notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalide Email adress'),
        
    
    check('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    validatorMiddleware,
];