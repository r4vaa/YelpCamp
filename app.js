const express = require('express');
const path =  require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');


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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makecampgrounds', async(req, res) => {
    const camp = new Campground({title: 'My Backyard' , description : 'Cheap Camping'})
    await camp.save();
    res.send(camp);
})

app.listen(3000, () => {
    console.log('Serving on Port 3000')
})