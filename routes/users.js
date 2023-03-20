const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const passport = require('passport');
const { checkReturnTo} = require('../middleware');
const users = require('../controllers/users');


router.route('/register')
    .get(users.renderRegister )
    .post(catchAsync(users.register));

router.route('/login')
    .get( users.renderLogin )
    .post(checkReturnTo,passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}),users.login)



// router.get('/logout', (req, res) => {
//     req.logout();
//     //req.flash('success', 'Goodbye!');
//     res.redirect('/campgrounds');
// })


router.get("/logout", users.logout);

module.exports = router;