const express = require("express")
const path = require('path')
const ExpressError = require("./helpers/ExpressError")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const engine = require('ejs-mate')
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require('./models/user')

//routes
const userRoutes = require("./routes/users")
const campgroundRoutes = require("./routes/campgrounds")
const reviewRoutes = require("./routes/reviews")

mongoose.connect("mongodb://localhost:27017/yelp-camp")

const app = express();

app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "public")))
const sessionConfig = {
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true, 
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.use("/", userRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
})

app.get("/", (req, res) => {
    res.render('home');
})

app.all("*", (req, res, next) =>{
    next(new ExpressError("Page not found", 404))
})

app.use((err, req, res, next) => {
    const {status = 500} =  err;
    if(!err.msg) err.msg = "Something went wrong";
    res.status(status).render("errors", {err})
})


app.listen(3000, () => {
    console.log("Serving on port 3000")
})