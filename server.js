// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient
const url = require('url');
let collect;



function dbInsert(collection,data) {
  collection.insert(data, function(err, data) {
    if (err) throw err
  })
}

function dbQuery(collection,searchPath,cb) {
  collection.find({
    path : { $eq: searchPath }
  }).toArray(function(err, documents) {
    cb(documents.length);
  })
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
  let insObj = {
  'quickID' : get_count(collect, function(count) {return count + 1}),
  'path' : req.path
  }
  let exists = dbQuery(collect,req.path,function(num) {
    if (num > 0) {
      console.log("already exists")
    }
    else {
      dbInsert(collect,insObj);
    }});
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

var get_count = function(collection, cb){
  collection.find().count(function (e, count) {
      console.log(count);
    return count + 1
      //return cb(count);
    });
};