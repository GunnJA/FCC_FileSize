// server.js
// where your node app starts

// init project
const key = process.env.KEY;
const cx = process.env.CX;
const express = require('express');
const app = express();
const http = require('http');
const mongo = require('mongodb').MongoClient
const url = require('url');
const APIurl = "https://www.googleapis.com";
const dbCollection = "fccsearch";
let database;
let collect;

var google = require('googleapis');
var customsearch = google.customsearch('v1');

function imageSearch() customsearch.cse.list({ cx: cx, q: "dogs", auth: key, searchType: "image", num: 10 }, function (err, resp) {
  if (err) {
    return console.log('An error occured', err);
  }
  // Got the response from custom search
  console.log('Result: ' + resp.searchInformation.formattedTotalResults);
  console.log(resp);
});
}

let options = {
  hostname: APIurl,
  port: 8080,
  path: '/customsearch/v1?q=%22stars%22&cx=015452621321954620393%3Aqo5wx60lbq0&key=',
  method: 'GET'
}

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

//req.write(postData);
req.end();

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