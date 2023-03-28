/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is the category Model & Shema to define the database
*/

const mongoose = require('mongoose');

// 1- create Schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Category required'],
        unique: [true, 'Category must be unique'],
        minlength: [3, 'To short category name'],
        maxLength: [32, 'To long category name'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image: String,
}, { timestamps: true });

/* // middeleware for findOne or findAll and update return data from db
categorySchema.post('init', (doc) => {
    // return image base url + image name
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imageUrl;
    }
});

// middeleware for getCreate return data from db
categorySchema.post('save', (doc) => {
    // return image base url + image name
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imageUrl;
    }
});
 */
// 2- create model
const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;