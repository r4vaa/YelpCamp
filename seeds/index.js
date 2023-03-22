const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');


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

// create a random number from our given array for title name
const sample = array => array[Math.floor(Math.random()* array.length)]



const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 200 ;i ++){
        const random1000 = Math.floor(Math.random() *1000);
        const price = Math.floor(Math.random() *20) +10 ;
        const camp = new Campground(  {
            author : '6411992d3e3d12948345e9aa',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            // image : 'https://source.unsplash.com/collection/483251',
            description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus placeat ab totam, officiis recusandae voluptatem reiciendis ducimus voluptatum facere fugit molestiae vitae sunt perspiciatis veritatis architecto esse eaque aspernatur maxime?',
            price,
            geometry: { 
                type: 'Point', 
                coordinates: [
                     cities[random1000].longitude,
                     cities[random1000].latitude
                     ] },
            images : [
                {
                  url: 'https://res.cloudinary.com/dcgx40pni/image/upload/v1679403388/YelpCamp/loj9robmphhllfdso7lj.jpg',
                  filename: 'YelpCamp/loj9robmphhllfdso7lj',
                  
                },
                {
                    url: 'https://res.cloudinary.com/dcgx40pni/image/upload/v1679403389/YelpCamp/drnc3q5qtz1mzsxwqq5q.jpg',
                    filename: 'YelpCamp/drnc3q5qtz1mzsxwqq5q',
               
                }
                
            ]
        })
        await camp.save();

    }
}

seedDB().then(() => {
    mongoose.connection.close();
})