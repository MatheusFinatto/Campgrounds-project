const express = require("express");
const router = express.Router();
const catchAsync = require('../helpers/catchAsync')
const ExpressError = require("../helpers/ExpressError")
const Campground = require("../models/campground")
const {campgroundSchema} = require("../schemas.js") 
const {isLoggedIn} = require("../middleware")


const validateCampground = (req,res,next) =>{
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400)

   const {error} = campgroundSchema.validate(req.body)
   if(error){
       const msg = error.details.map(el => el.message).join(',')
       throw new ExpressError(msg, 400)
   }else{
       next();
   }
}


router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render("campgrounds/index", { campgrounds })
}))

router.get("/new", isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/new", { campground })
}))

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save();
    req.flash("success", "Successfully made a new campground")
    res.redirect(`/campgrounds/${campground._id}`)
 
}))

router.get("/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    if(!campground){
        req.flash("error", "Campground not found")
        return res.redirect("/campgrounds")
    } 
    res.render("campgrounds/show", { campground })
}))

router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash("error", "Campground not found")
        return res.redirect("/campgrounds")
    } 
    res.render("campgrounds/edit", { campground })
}))

router.put("/:id", isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash("success", "Campground updated successfully!")
    res.redirect(`/campgrounds/${campground._id}`)

}))

router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect(`/campgrounds/`)

}))

module.exports = router;