const router = require("express").Router({mergeParams: true});
const catchAsync = require('../helpers/catchAsync')
const {reviewSchema} = require("../schemas.js") 
const Campground = require("../models/campground")
const Review = require("../models/reviews")
const ExpressError = require("../helpers/ExpressError")


const validateReview =(req,res,next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req,res) =>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash("success", "Review created!")
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete("/:reviewId", catchAsync(async(req,res) =>{
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId)
    req.flash("success", "Review deleted!")

    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;