/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a modul has methods for verify token middleware
*/

const JWT = require('jsonwebtoken');

// verify the auth token
const verifyToken = (req, res, next) => {

    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        JWT.verify(token, process.env.JWT_SEC, (err, user) => {

            if (err) res.status(403).json("Token is not valid!");
            req.user = user;
            next();
        });
    } else {

        return res.status(401).json("You are not authentificated!");

    }

};


// verify the auth tokent and the authorization
const verifyTokenAndAuthorization = (req, res, next) => {

    verifyToken(req, res, () => {

        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }

    });

};

// verify the auth tokent and the authorization and the user is Admin
const verifyTokenAndAuthorizationAndIsAdmin = (req, res, next) => {

    verifyToken(req, res, () => {

        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }

    });

};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAuthorizationAndIsAdmin };