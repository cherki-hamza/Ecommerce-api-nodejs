/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a category validator roles module
*/

const { check , body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const { default: slugify } = require('slugify');

exports.getCategoryValidator = [
    check('id').isMongoId().withMessage([
        {
            en: "Invalide category id format",
            fr: "Format d'identifiant de catégorie non valide",
            ar: "تنسيق معرف الفئة غير صالح",
        }
    ]),

    validatorMiddleware,
];

exports.createCategoyValidator = [
    check('name').notEmpty().withMessage('Category is required')
        .isLength({ min: 3 }).withMessage('To short category name')
        .isLength({ max: 32 }).withMessage('To long category name')
        .custom((val , {req}) => {
            req.body.slug = slugify(val);
            return true;
        }),

    validatorMiddleware,
];


exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalide category id format'),

    body('name')
        .optional()  
        .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
     }),

    validatorMiddleware,
];

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalide category id format'),

    validatorMiddleware,
];