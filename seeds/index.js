const mongoose = require("mongoose")
const cities = require("./cities")
const {places, descriptors} = require('./seedHelpers')
const Campground = require("../models/campground");

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async() =>{
    await Campground.deleteMany({});
    for(let i=0; i < 50; i++){
        const random = Math.floor(Math.random() * 1000) + 1
        const camp = new Campground({
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})