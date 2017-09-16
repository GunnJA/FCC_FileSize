// server.js
// where your node app starts

// init project
const key = process.env.KEY;
const cx = process.env.CX;
const mongoURL = process.env.MURL;
const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient;
const dbCollection = "fccsearch";
let offsetDefault = 10;
let database;
let collect;

var google = require('googleapis');
var customsearch = google.customsearch('v1');

// Google Images API call
function imageSearch(q,num) {
  return new Promise(function (resolve, reject) {
    customsearch.cse.list({ cx: cx, q: q, auth: key, searchType: "image", num: num }, function (err, resp) {
      if (err) {
        return console.log('An error occured', err);
      }
      // Got the response from custom search
      console.log('Result: ' + resp.searchInformation.formattedTotalResults);
      resolve(resp);
    });
  });
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

//DB functions
mongo.connect(mongoURL,(err, db) => {
  if (err) throw err
  else console.log("db connection successful")
  collect = db.collection(dbCollection);
  database = db;
// db.close();
});

function dbInsert(collection,obj) {
  collection.insert(obj, function(err, data) {
    if (err) throw err
    database.close;
    console.log("insert complete");
  })
}

function finder(collection) {
  return collection.find({});
}

//Routing
app.get("/search/:query", function (req, res) {
  const searchQ = req.params.query;
  dbInsert(collect,{ "query": searchQ })
  if (req.query.offset) {
    console.log("offset", req.query.offset);
    console.log("searchQ", searchQ);
    imageSearch(searchQ,req.query.offset).then(function(data) {
      res.send(data.items);
    });
  }else {
    console.log("no offset", searchQ);
    imageSearch(searchQ,offsetDefault).then(function(data) {
      res.send(data.items);
    });
  }
});

app.get("/recent", function (req, res) {
  let promRetr = new Promise(function (resolve, reject) {
    finder(collect).toArray(function (err,data) {
      resolve(data);
    })
  })
  promRetr.then(function(data) {
    res.send(data);
  })
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});