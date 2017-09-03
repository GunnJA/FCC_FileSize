// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient
const url = require('url');
let collect;

let insObj = {
  'quickID' : 1,
  'path' : '/http://www.google.com'
}

function dbInsert(collection,data) {
  collection.insert(data, function(err, data) {
    if (err) throw err
  })
}

function dbQuery(collection,searchPath) {
  let result;
  collection.find({
    path : { $eq: searchPath }
  }).toArray(function(err, documents) {
    console.log(documents)
    result = documents
  })
  return result
}


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));


mongo.connect("mongodb://gunnja:gunnja@ds123124.mlab.com:23124/fccmongo",(err, db) => {
  if (err) throw err
  else console.log("db connection successful")
  collect = db.collection('myColl');
  
// remove all entries 
//collect.remove()
//  db.close();
});


//const db = mongo.connection;
//const followers = await User.aggregate(aggregateQuery).exec();
// http://expressjs.com/en/starter/basic-routing.html
app.get("/*", function (req, res) {
  let exists = dbQuery(collect,req.path);
  if (!exists) {
    console.log("if",dbQuery(collect,req.path))
    //dbInsert(collect,insObj)
  } else {
    console.log("else",exists);
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
