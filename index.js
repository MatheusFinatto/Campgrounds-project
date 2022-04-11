const express = require("express")
const app = express();
const ejs = require('ejs');

app.get("/", (req,res) => {
    res.sendFile(__dirname + '/index.html');
})

app.listen(3000, (req,res) =>{
    console.log("Serving on port 3000")
})