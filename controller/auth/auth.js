/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a auth  controller
*/

const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ApiError = require('../../utils/apiError');
const User = require('../../models/userModel');
const bcrypt = require('crypto-js');
const JWT = require('jsonwebtoken');

// @desc    register new user
// @route   post /register
// @access  public
const register = asyncHandler(async (req, res) => {


    const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        slug: slugify(req.body.username),
        phone: req.body.phone,
        password: bcrypt.AES.encrypt(req.body.password, process.env.SECRET_KEY),
    });


    res.status(201).json({ data: newUser });

});


// @desc    login the user
// @route   get /login
// @access  public
const login = asyncHandler(async (req, res) => {

    const user = await User.findOne({
        username: req.body.username,
    });

    if (!user) {
        res.status(401).json("Wrong cedentials!");
    }

    const hashedPassword = bcrypt.AES.decrypt(user.password, process.env.SECRET_KEY);

    const password = hashedPassword.toString(bcrypt.enc.Utf8);

    if (password !== req.body.password) {
        res.status(401).json("Wrong cedentials!");
    }

    if (password == req.body.password) {

        const accessToken = JWT.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );

        const { password, ...userdata } = user._doc

        res.status(200).json({ ...userdata, accessToken });
    }




});




module.exports = { register, login };