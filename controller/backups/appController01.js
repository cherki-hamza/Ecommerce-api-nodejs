/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a main app controller
*/

const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');


// ch engine
const handelURLRequest = ('/url', function (req, res) {
    res.render('view', {
        page: req.url,
        nav: {
            'Page 1': '/page1',
            'Page 2': '/page2',
            'Page 3': '/page3'
        }
    });
});

// function for handel language
const handelLanguages = (req, res, next) => {
    req.e.preventDefault();
    next();
}

// @desc    get the main app url
// @route   get /
// @access  public
const main = asyncHandler(async (req, res) => {

    let content = req.url == '/' ? 'home' : '';

    //console.log(req.app.locals.langs);

    res.render('index', { content });

});



// @desc    get the about app url
// @route   get /about
// @access  public
const about = asyncHandler(async (req, res) => {

    let content = req.url;
    res.render('index', { content });

});

// @desc    get the portfolio app url
// @route   get /portfolio
// @access  public
const portfolio = asyncHandler(async (req, res) => {

    let content = req.url;
    res.render('index', { content });

});

// @desc    get the contact app url
// @route   get /contact
// @access  public
const contact = asyncHandler(async (req, res) => {

    let content = req.url;
    res.render('index', { content });

});


// @desc    get the register app url
// @route   get /register
// @access  public
const register = asyncHandler(async (req, res) => {

    let content = req.url;
    res.render('index', { content });

});


// @desc    get the login app url
// @route   get /login
// @access  public
const login = asyncHandler((req, res) => {

    let content = req.url;

    console.log(req.body);

    res.render('index', { content });

});

// login_form post
const login_form = asyncHandler((req, res) => {
    console.log(req.body);
});



module.exports = { main, about, portfolio, contact, register, login, login_form };