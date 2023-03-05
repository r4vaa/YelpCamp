const express = require('express');
const path =  require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const Campground = require('./models/campground');
const methodOverride = require('method-override');



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
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`)
     
}))

app.get('/campgrounds/:id' , catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}))

app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit' ,{ campground});
}))

app.put('/campgrounds/:id' , catchAsync(async( req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground} );
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/makecampgrounds', catchAsync(async(req, res) => {
    const camp = new Campground({title: 'My Backyard' , description : 'Cheap Camping'})
    await camp.save();
    res.send(camp);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.use((err, req, res , next) =>{
    res.send('Oh Boy, something went Wrong');
})

app.listen(3000, () => {
    console.log('Serving on Port 3000')
})