const express = require("express")
const app = express();
const ejs = require('ejs');

app.get("/", (req,res) => {
    res.render('index.ejs');
})

app.listen(3000, (req,res) =>{
    console.log("Serving on port 3000")
})