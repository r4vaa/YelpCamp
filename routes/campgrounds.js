const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const Campground = require('../models/campground');
const { isLoggedIn ,isAuthor, validateCampground } = require('../middleware')
const multer  = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground));
    

router.get('/new' ,isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor,catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit',  isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));



// router.get('/makecampgrounds', catchAsync(async(req, res ,next) => {
//     const camp = new Campground({title: 'My Backyard' , description : 'Cheap Camping'})
//     await camp.save();
//     res.send(camp);
// }))



module.exports = router;