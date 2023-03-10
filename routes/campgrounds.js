const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground');
const { campgroundSchema , reviewSchema } = require('../schemas.js')


const validateCampground = (req, res ,next)=> {
    
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
       next();
    }
}



router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' , { campgrounds})
}))


router.get('/new' , (req, res) => {
    res.render('campgrounds/new');
})

router.post('/' ,validateCampground, catchAsync(async(req, res, next) => {
        // if(!req.body.campground) throw new ExpressError('INVALID CAMPGROUND',400);
        const campground = new Campground(req.body.campground); 
        await campground.save();
        req.flash('success', 'successfully made a new campground!')
        res.redirect(`/campgrounds/${campground._id}`)
     
}))

router.get('/:id' , catchAsync(async(req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('error','Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))

router.get('/:id/edit', catchAsync(async(req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error','Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit' ,{ campground});
}))

router.put('/:id' , validateCampground,catchAsync(async( req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground} );
    req.flash('success', 'Successfully update campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/makecampgrounds', catchAsync(async(req, res ,next) => {
    const camp = new Campground({title: 'My Backyard' , description : 'Cheap Camping'})
    await camp.save();
    res.send(camp);
}))

router.delete('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}))


module.exports = router;