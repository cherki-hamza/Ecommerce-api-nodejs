/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a main router module 
*/


const express = require('express');
const router = express.Router();
const { main, about, portfolio, contact, register, login, login_form } = require('../controller/appController');
const { verifyToken } = require('../middlewares/verifyToken');

// frontend routes
router.route('/').get(main);
router.route('/about').get(about);
router.route('/portfolio').get(portfolio);
router.route('/contact').get(contact);
router.route('/register').get(register);
router.route('/login').get(login);
router.route('/login').post(login_form);

// backend routes

module.exports = router;