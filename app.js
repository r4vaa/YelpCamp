const express = require('express');
const path =  require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const Joi = require('joi')
const { stat } = require('fs');



mongoose.set('strictQuery', false);
    main().catch(err => console.log(err));
    async function main() { await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
        .then(() => {
        console.log('Database Connected')
        })
        .catch(err => {
            console.log('OH no !! Mongoose ErroR!!!');
            console.log(err)
    })
    }
const app =  express();

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded( { extended : true} ))
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' , { campgrounds})
}))

app.get('/campgrounds/new' , (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds' , catchAsync(async(req, res, next) => {
        // if(!req.body.campground) throw new ExpressError('INVALID CAMPGROUND',400);
        const campgroundSchema = Joi.object({
           campground: Joi.object({
            title : Joi.string().required(),
            price: Joi.number().min(0).required(),
            image : Joi.string().required(),
            location : Joi.string().required(),
            description : Joi.string().required()
           }).required()
        })
        const { error } = campgroundSchema.validate(req.body);
        if(error) {
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        }
        console.log(result);
        const campground = new Campground(req.body.campground); 
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`)
     
}))

app.get('/campgrounds/:id' , catchAsync(async(req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}))

app.get('/campgrounds/:id/edit', catchAsync(async(req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit' ,{ campground});
}))

app.put('/campgrounds/:id' , catchAsync(async( req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground} );
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/makecampgrounds', catchAsync(async(req, res ,next) => {
    const camp = new Campground({title: 'My Backyard' , description : 'Cheap Camping'})
    await camp.save();
    res.send(camp);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.all('*', (req, res ,next) =>{
    next(new ExpressError('Page Not Found ', 404));
})

app.use((err, req, res , next) =>{
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh NO, Something Went Wrong!';
    res.status(statusCode).render('error',{ err });
})

app.listen(3000, () => {
    console.log('Serving on Port 3000')
})