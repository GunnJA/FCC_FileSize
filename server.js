// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient
const url = require('url');

let insObj = {
  'quickID' : 1,
  'path' : 'http://www.google.com'
}

function dbInsert(collection,data) {
  collection.insert(data, function(err, data) {
    if (err) throw err
    console.log(data);
  })
}

function dbQuery(collection,searchPath) {
  let result = collection.find({
    path : searchPath
  })
  return result;
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));


mongo.connect("mongodb://gunnja:gunnja@ds123124.mlab.com:23124/fccmongo",(err, db) => {
  if (err) throw err
  else console.log("db connection successful")
  var collect = db.collection('myColl');


// remove all entries 
//collect.remove()
  db.close();
});


//const db = mongo.connection;
//const followers = await User.aggregate(aggregateQuery).exec();
// http://expressjs.com/en/starter/basic-routing.html
app.get("/*", function (req, res) {
  console.log(req);
  res.sendFile(__dirname + '/views/index.html');
  console.log(req.path);
});

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
