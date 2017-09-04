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


app.get("/*", function (req, res) {

  let exists = dbQuery(collect,req.path,function(num) {
    console.log("dbQuery:",num);
    if (num > 0) {
      console.log("already exists")
    }
    else {
      getCount(collect,req, createObj,function(collection, obj) {
        console.log("new entry");
        dbInsert(collection, obj);
        console.log(obj);
      })
    }
  })
})
  

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

function getCount(collection, req, cb1, cb2) {
  collection.find({}).toArray(function(err, documents) {
    cb1(collection, req, documents.length, cb2);
  })
  
  let count = collection.find().count();
  console.log("getCount",count);
  cb1(collection, req, count, cb2);
}

let createObj = function(collection, req, count, cb) {
  let obj = {
  'quickID' : count,
  'path' : req.path
  }
  console.log("createObj",obj);
  cb(collection, obj);
}