/*  
*   @author : cherki hamza
*   @website : https://hamzacherki.com
*   @desc this class is responsible about errors handlers (catch the error and handel it) 
*/
class ApiError extends Error {

    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
        this.isOperational = true;
    }
}

module.exports = ApiError;