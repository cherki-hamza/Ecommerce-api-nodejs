/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is the barand Model & Schema to define the database
*/

const mongoose = require('mongoose');

// 1- create Schema
const barandSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'barand required'],
        unique: [true, 'barand must be unique'],
        minlength: [3, 'To short barand name'],
        maxLength: [32, 'To long barand name'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image: String,
}, { timestamps: true });

/* // middeleware for findOne or findAll and update return data from db
barandSchema.post('init', (doc) => {
    // return image base url + image name
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageUrl;
    }
});

// middeleware for getCreate return data from db
barandSchema.post('save', (doc) => {
    // return image base url + image name
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageUrl;
    }
}); */

// 2- create model
const barandModel = mongoose.model('Brand', barandSchema);

module.exports = barandModel;