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

const usersRoutes = require('./routes/users')
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');



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
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret : 'thisshouldbeabettersecret!',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser' , async(req, res) => {
    const user = new User({ email: 'patil56@gmail.com', username:'dhee'});
    const newUser = await User.register(user, 'chicken');
    res.send(newUser)
})


app.use('/',usersRoutes);
app.use('/campgrounds' , campgroundsRoutes);
app.use('/campgrounds/:id/reviews' , reviewsRoutes);

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