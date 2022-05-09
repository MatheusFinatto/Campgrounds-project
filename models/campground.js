const mongoose = require('mongoose');
const { unsubscribe } = require('../routes/users');
const reviews = require('./reviews');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    img: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref:"User",
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
})


CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await reviews.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    } else next();
})

module.exports = mongoose.model('Campground', CampgroundSchema)
