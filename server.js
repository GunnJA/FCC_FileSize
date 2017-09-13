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
const APIurl = "https://www.googleapis.com/customsearch/v1?"
const dbCollection = "fccsearch";
let database;
let collect;

let options = {
  hostname: 'www.googleapis.com',
  port: 80,
  path: '/customsearch/v1?cx=015452621321954620393:qo5wx60lbq0&q=dog&key=AIzaSyCRzwpBjrvOl-3mWeJRQLUcNwoSoioo3bw',
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

req;

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