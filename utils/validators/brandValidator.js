/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a Brand validator roles module
*/

const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const { default: slugify } = require('slugify');

exports.getBrandValidator = [
    check('id').isMongoId().withMessage([
        {
            en: "Invalide Brand id format",
            fr: "Format d'identifiant de catégorie non valide",
            ar: "تنسيق معرف الفئة غير صالح",
        }
    ]),

    validatorMiddleware,
];

exports.createBrandValidator = [
    check('name').notEmpty().withMessage('Brand is required')
        .isLength({ min: 3 }).withMessage('To short Brand name')
        .isLength({ max: 32 }).withMessage('To long Brand name'),

    body('name').custom((val , {req}) => {
        req.body.slug = slugify(val);
        return true;
    }),    

    validatorMiddleware,
];


exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalide Brand id format'),

    body('name')
        .optional()
        .custom((val, { req }) => {
       req.body.slug = slugify(val);
       return true;
    }),

    validatorMiddleware,
];

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('Invalide Brand id format'),

    validatorMiddleware,
];