/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a subCategory validator roles module
*/

const { check , body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const { default: slugify } = require('slugify');

exports.createSubCategoyValidator = [
    check('name').notEmpty().withMessage('subCategory is required')
        .isLength({ min: 2 }).withMessage('To short subCategory name')
        .isLength({ max: 32 }).withMessage('To long subCategory name')
        .custom((val , {req}) => {
            req.body.slug = slugify(val);
            return true;
        }),    

    check('category').notEmpty().withMessage('subCategory most be belongs to category')
        .isMongoId().withMessage('Invalid Category id format'),

    validatorMiddleware,
];

exports.getsubCategoryValidator = [
    check('id').isMongoId().withMessage([
        {
            en: "Invalide subCategory id format",
            fr: "Format d'identifiant de catégorie non valide",
            ar: "تنسيق معرف الفئة غير صالح",
        }
    ]),

    validatorMiddleware,
];

exports.updatesubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalide subCategory id format'),

    body('name').custom((val , {req}) => {
        req.body.slug = slugify(val);
        return true;
     }),

    validatorMiddleware,
];

exports.deletesubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalide subCategory id format'),

    validatorMiddleware,
];