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
    for(let i = 0; i < 50 ;i ++){
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
                  url: 'https://res.cloudinary.com/dcgx40pni/image/upload/v1679383806/YelpCamp/mszhatdetvzwzj5nekft.jpg',
                  filename: 'YelpCamp/mszhatdetvzwzj5nekft',
                  
                },
                {
                    url: 'https://res.cloudinary.com/dcgx40pni/image/upload/v1679382951/YelpCamp/accsxyv9apkcydo3ymjz.jpg',
                    filename: 'YelpCamp/accsxyv9apkcydo3ymjz',
               
                }
                
            ]
        })
        await camp.save();

    }
}

seedDB().then(() => {
    mongoose.connection.close();
})