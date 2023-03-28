/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a Product Schema Model
*/

const mongoose = require('mongoose');

const productShema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'To short product title'],
        maxlength: [100, 'To long product title'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, 'product description is required'],
        minlength: [20, 'To short product description'],
    },
    quantity: {
        type: Number,
        required: [true, 'product quantity is required'],
    },
    sold: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'product price is required'],
        trim: true,
        //max: [9999999, 'To long product price'],
    },
    priceAfterDiscount: {
        type: Number,
    },
    colors: [String],
    imageCover: {
        type: String,
        required: [true, 'product image cover is required'],
    },
    images: [String],
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'product must be belong to category'],
    },
    subcategory: [{
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory'
    }],
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand',
    },
    ratingAverage: {
        type: Number,
        min: [1, 'Rating must be above or equal 1.0'],
        max: [5, 'Rating must be above or equal 5.0'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Mongoose query middleware
productShema.pre(/^find/, function(next){
    this.populate(
        {path:'category',select:'name'},
    );
    this.populate(
        {path:'subcategory',select:'name'},
    );
    next();
});

/* 
// middeleware for findOne or findAll and update return data from db at imageCover
productShema.post('init', (doc) => {
    // return image base url + image name
    if (doc.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover = imageUrl;
    }
});

// middeleware for getCreate return data from db at imageCover
productShema.post('save', (doc) => {
    // return image base url + image name
    if (doc.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover = imageUrl;
    }
});

// middeleware for findOne or findAll and update return data from db at images
productShema.post('init', (doc) => {
    // return image base url + image name
    if (doc.images) {
        const imagesList = [];
        doc.images.forEach((img) => {
            const imageUrl = `${process.env.BASE_URL}/products/${img}`;
            imagesList.push(imageUrl);
        });
        
        doc.images = imagesList;
    }
});

// middeleware for findOne or findAll and update return data from db at images
productShema.post('save', (doc) => {
    // return image base url + image name
    if (doc.images) {
        const imagesList = [];
        doc.images.forEach((img) => {
            const imageUrl = `${process.env.BASE_URL}/products/${img}`;
            imagesList.push(imageUrl);
        });
        
        doc.images = imagesList;
    }
});
 */
// 2- create model
const ProductModel = mongoose.model('Product', productShema);

module.exports = ProductModel;