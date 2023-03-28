/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is the Global Error Handler Middleware for handel the errors
*/

const ApiError = require("../utils/apiError");

// method for catch the specific error
const handleJwtInvalidSignature = () => {
    return new ApiError("Invalid token , Pleas login again..", 401);
} 
// method for handel if jwt token is expired
const handleJwtExpired = () => {
    return new ApiError("Expired token , Pleas login again..", 401);
} 

// globale error handler off all application
const GlobalerrorHandlerMiddleware = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorForDevelopmentMode(err, res);
    } else {
        if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
         if (err.name === 'TokenExpiredError') err = handleJwtExpired();
        
        sendErrorForProductionMode(err, res);
    }

};

// handel error for devlopment Mode
const sendErrorForDevelopmentMode = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};


// handel error for production Mode
const sendErrorForProductionMode = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};

module.exports = GlobalerrorHandlerMiddleware;