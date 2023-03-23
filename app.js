if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}



// console.log(process.env.SECRET);
// console.log(process.env.API_KEY);

const express = require('express');
const path =  require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError')
const flash = require('connect-flash');
const methodOverride = require('method-override');
const Joi = require('joi');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const multer  = require('multer')

const usersRoutes = require('./routes/users')
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
// const MongoDBStore = require('connect-mongo')(session);
const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
mongoose.set('strictQuery', false);
    main().catch(err => console.log(err));
    async function main() { await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        useUnifiedTopology: true,
        // useFindAndModify: false
    })
        .then(() => {
        console.log('Database Connected')
        })
        .catch(err => {
            console.log('OH no !! Mongoose ErroR!!!');
            console.log(err)
    })
    }
const app =  express();

app.engine('ejs',ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded( { extended : true} ))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({replaceWith: '_',}))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret,
    },
    touchAfter:24 * 60 * 60
  })

store.on('error', function (e) {
    console.log('SESSION STORE ERROR',e)
})

const sessionConfig = {
    store,
    name:'session',
    secret ,
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        // secure : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(helmet({
    // contentSecurityPolicy : false,
    // crossOriginEmbedderPolicy : false    
}));
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/", // need to add this for style
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dcgx40pni/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    // console.log(req.query);
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeUser' , async(req, res) => {
//     const user = new User({ email: 'patilss56@gmail.com', username:'dhees'});
//     const newUser = await User.register(user, 'chicken');
//     res.send(newUser)
// })


app.use('/', usersRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
    res.render('home')
})


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




