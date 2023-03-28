/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is the main app 
*/

// all librarys
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config({ path: 'config.env' });
const dbConnection = require('./config/database');
const translate = require('translate');
const ejs = require('ejs');
const path = require('path');
const ApiError = require('./utils/apiError');
const GlobalerrorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');

// all application routes
const authRoute = require('./routes/authRoute');
const appRouter = require('./routes/appRouter');
const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const usersRoute = require('./routes/usersRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');

// swager documentation
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// Connect to Database
dbConnection();

// express app    
const app = express();

// set application global data
app.locals = {
    langs: [
        { lang_code: 'en', lang_name: 'English' },
        { lang_code: 'fr', lang_name: 'Fransh' },
        { lang_code: 'ar', lang_name: 'Arabic' },
    ],
    url: 'cherki hamza',
    helper: require('./helpers/helper'),
};





// public path
let publicPath = path.join(__dirname, 'public/');

// set template engine to ejs
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(/* '/uploads', */ express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(express.json());
// check the mode of development and use morgan midelleware for the http requiests
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}


// Mount route
app.use("/", appRouter);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);

// swagger documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// error handler
app.all('*', (req, res, next) => {

    // Create error and send it to error handling middleware
    //const err = new Error(`Can't find this route: ${req.originalUrl}`);
    //send the error to next middleware 
    //next(err.message);
    // class apiErrors to handel errors
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Middleware
app.use(GlobalerrorHandlerMiddleware);

// run app express server
const PORT = process.env.PORT || 8000;
const server = app.listen(8000, () => {
    console.log(`App running at port : ${PORT}`);
});


// handel rejections and errors exeptions outside express and node js
// Event ==> listen ==>  callback
process.on('unhandledRejection', (err) => {

    console.error(`unhandledRejection Error: ${err.name} | ${err.message}`);

    server.close(() => {
        console.error(`Sutting down the application good by :) .....`);
        process.exit(1);
    })

});