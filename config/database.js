/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this database module for coonect the app
*/


const mongoose = require('mongoose');

const dbConnection = () => {

    // Connect Database
    mongoose.set("strictQuery", true);

    mongoose.connect(process.env.DB_URI)
        .then((conn) => {
            console.log(`Database Connect with success at: ${conn.connection.host}`);
        })
    /* .catch((err) => {
        console.error(`Database Error: ${err}`);
        process.exit(1);
    }) */

}
module.exports = dbConnection;