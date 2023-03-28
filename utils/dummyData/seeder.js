/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a seeder script for dummy data
*/


const fs = require('fs');
require('colors');
const dotenv = require('dotenv');
const Product = require('../../models/productModel');
const dbConnection = require('../../config/database');
const Brand = require('../../models/brandModel');
const Category = require('../../models/categoryModel');

dotenv.config({ path: '../../config.env' });

// connect to DB
dbConnection();


//********************* products seed *************************//
// Read products data
const products = JSON.parse(fs.readFileSync('./products.json'));



// Insert data into DB
const insertProductsData = async () => {
    try {
        await Product.create(products);

        console.log('--------------------Data Products Inserted With Success---------------------'.green.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// Delete data from DB
const destroyProductsData = async () => {
    try {
        await Product.deleteMany();
        console.log('-------------------------Data Products Destroyed With Success---------------------'.red.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// node seeder.js -pi or -pd
if (process.argv[2] === '-pi') {  // -pi : products insert
    insertProductsData();
} else if (process.argv[2] === '-pd') {  // -pd : products delete
    destroyProductsData();
}


//********************* brands seed *************************//
// Read brands data
const brands = JSON.parse(fs.readFileSync('./brands.json'));

// Insert data into DB
const insertBrandsData = async () => {
    try {
        await Brand.create(brands);

        console.log('--------------------Data Brands Inserted With Success---------------------'.green.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// Delete data from DB
const destroyBrandsData = async () => {
    try {
        await Brand.deleteMany();
        console.log('-------------------------Data Brands Destroyed With Success---------------------'.red.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// node seeder.js -bi or bd
if (process.argv[2] === '-bi') {  // -pi : brands insert
    insertBrandsData();
} else if (process.argv[2] === '-bd') {  // -pd : brands delete
    destroyBrandsData();
}

//********************* categories seed *************************//
// Read brands data
const categories = JSON.parse(fs.readFileSync('./categories.json'));

// Insert data into DB
const insertCategoriesData = async () => {
    try {
        await Category.create(categories);

        console.log('--------------------Data categories Inserted With Success---------------------'.green.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// Delete data from DB
const destroyCategoriesData = async () => {
    try {
        await Category.deleteMany();
        console.log('-------------------------Data categories Destroyed With Success---------------------'.red.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// node seeder.js -ci or -cd
if (process.argv[2] === '-ci') {  // -ci : categories insert
    insertCategoriesData();
} else if (process.argv[2] === '-cd') {  // -cd : categories delete
    destroyCategoriesData();
}