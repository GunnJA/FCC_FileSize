// server.js
// where your node app starts

// init project
const key = process.env.KEY;
const cx = process.env.CX;
const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient
const url = require('url');
const dbCollection = "fccsearch";
let database;
let collect;

var google = require('googleapis');
var customsearch = google.customsearch('v1');

// Function to search google images
function imageSearch(q,num) {
  customsearch.cse.list({ cx: cx, q: q, auth: key, searchType: "image", num: num }, function (err, resp) {
    if (err) {
      return console.log('An error occured', err);
    }
    // Got the response from custom search
    console.log('Result: ' + resp.searchInformation.formattedTotalResults);
    console.log(resp);
  });
}

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
app.get(/^\/search\/.+(?=\?)/, function (req, res) {
  let searchQ = (req.path.split("/"))[2];
  console.log("no offset",searchQ);
})

app.get(/^\/search\/.+(?!\?)/, function (req, res) {
  let searchQ = (req.path.split("/"))[2];
  let offset = req.query.offset;
  console.log(searchQ);
  console.log(offset);
})

app.get("/urls", function(req, res) {

});
  
// Redirect existing shortened urls
app.get(/\d+/, function (req, res) {

})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});