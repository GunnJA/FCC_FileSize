// server.js
// where your node app starts

// init project
const key = process.env.KEY;
const cx = process.env.CX;
const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient
const url = require('url');
const APIurl = "https://www.googleapis.com/customsearch/v1?"
const dbCollection = "fccsearch";
let database;
let collect;

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

mongo.connect("mongodb://gunnja:gunnja@ds131854.mlab.com:31854/fccdb",(err, db) => {
  if (err) throw err
  else console.log("db connection successful")
  collect = db.collection(dbCollection);
  database = db;
// db.close();
});

// Get new urls
app.get(/^\/(http\:\/\/|https\:\/\/).+/, function (req, res) {
  exists(collect, req, res, {
    path : { $eq: req.path.substring(1) }
  })
})

app.get("/urls", function(req, res) {
  let promRetr = new Promise(function (resolve, reject) {
    finder(collect,{}).toArray(function (err,data) {
      let urls = data;
      resolve(urls);
    });
  }).then(function(urls) {
    res.send(urls);
  })
});
  
// Redirect existing shortened urls
app.get(/\d+/, function (req, res) {
  let id = req.path.substring(1);
  dbFind(collect,id,res)
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});