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

exports.createUserValidator = [
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

    check('phone').optional().isMobilePhone().withMessage('Invalide phone numbes'),
    check('profileImg').optional(),
    check('role').optional(),
    validatorMiddleware,
];

exports.getUserValidator = [
    check('id').isMongoId().withMessage([
        {
            en: "Invalide User id format",
            fr: "Format d'identifiant de catégorie non valide",
            ar: "تنسيق معرف الفئة غير صالح",
        }
    ]),

    validatorMiddleware,
];


exports.updateUserValidator = [
    check('id').isMongoId().withMessage('Invalide User id format'),

    body('username')
        .optional()  
        .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
     }),

    validatorMiddleware,
];

exports.changeUserPasswordValidator = [
    body('currentPassword').notEmpty().withMessage('You must enter your current password'),
    body('passwordConfirm').notEmpty().withMessage('You must enter the password confirm'),
    body('password').notEmpty().withMessage('You must enter the new password')
        .custom(async(val, { req }) => {
            // 1) verify current password
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new Error('There is no User not four this id');
            }
            const isCorrectPassword = await bcrypt.compare(
                req.body.currentPassword,
                user.password
            );
            if (!isCorrectPassword) {
                throw new Error('Incorrect Current Password');
            }
 
            // 2) verify  password confirme
            if (val !== req.body.passwordConfirm) {
                throw new Error('Password Confirmation incorect');
            }
            return true;

        }),
    
    validatorMiddleware,
];

exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('Invalide User id format'),

    validatorMiddleware,
];


exports.updateLggedUserValidator = [
    
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
  
    check('phone').optional().isMobilePhone().withMessage('Invalide phone numbes'),
    check('profileImg').optional(),

    validatorMiddleware,
];