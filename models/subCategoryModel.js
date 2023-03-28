/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is the Subcategory Model & Shema to define the database
*/

const mongoose = require('mongoose');

// 1- create the Schema
const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: [true, 'Subcategory must be unique'],
            minlength: [2, 'to short Subcategory name'],
            maxLength: [32, 'To long Subcategory name'],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: [true, 'SubCategory must be belongs to parent category'],
        },
    },
    { timestamps: true }
);

//module.exports = mongoose.model("SubCategory", subCategorySchema);

// 2- create model
const SubCategoryModel = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategoryModel;