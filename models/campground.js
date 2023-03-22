const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

// https://res.cloudinary.com/demo/image/upload/c_crop,g_face,h_400,w_400/r_max/c_scale,w_200/lady.jpg

const ImageSchema = new Schema({
                url: String,
                filename : String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload' , '/upload/w_200');
})
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type : {
            type :   String,
            enum : ['Point'],
            required : true
        },
        coordinates: {

        }
    },
    price : Number,
    description: String,
    location : String,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    reviews: [ 
        {
            type: Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
})



CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc) {
        await Review.deleteMany({
            _id:{
                $in : doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);