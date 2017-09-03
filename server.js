// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient
let insObj = {
  'path1' : 'http://www.google.com'
}

funct
//  collect.insert(insObj, function(err, data) {
//  if (err) throw err
//    console.log(data);
//  })

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));


mongo.connect("mongodb://gunnja:gunnja@ds123124.mlab.com:23124/fccmongo",(err, db) => {
  if (err) throw err
  else console.log("db connection successful")
  var collect = db.collection('myColl');

//
// to display all entries  
//  collect.find({
//    }, {
//      path1: 1
//    , _id: 1
//    }).toArray(function(err, documents) {
//      console.log(documents);
//    })
//  
// remove all entries 
//collect.remove()
  db.close();
});


//const db = mongo.connection;
//const followers = await User.aggregate(aggregateQuery).exec();
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
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
