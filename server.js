// server.js
// where your node app starts

// init project
const key = process.env.KEY;
const cx = process.env.CX;
const mongoURL = process.env.MURL;
const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient
const dbCollection = "fccsearch";
let offsetDefault = 10;
let database;
let collect;

var express = require('express')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
 
var app = express()
 
app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file 
  // req.body will hold the text fields, if there were any 
})

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});