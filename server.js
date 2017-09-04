// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient
const url = require('url');
let collect;


// functions
function dbInsert(collection,data) {
  collection.insert(data, function(err, data) {
    if (err) throw err
  })
}

function dbExists(collection,searchPath,cb) {
  collection.find({
    path : { $eq: searchPath }
  }).toArray(function(err, documents) {
    cb(documents.length);
  })
}

function dbFind(collection,id,cb) {
  let idNum = id.substring(1);
  collection.find({
    quickID : { $eq: parseInt(idNum) }
  }).toArray(function(err, documents) {
    console.log("docs",documents);
    cb(documents[0].path);
  })
}

function getCount(collection, req, cb1, cb2) {
  collection.find({}).toArray(function(err, documents) {
    cb1(collection, req, documents.length, cb2);
  })
}
  
let createObj = function(collection, req, count, cb) {
  let obj = {
  'quickID' : count,
  'path' : req.path
  }
  console.log("createObj",obj);
  cb(collection, obj);
}



// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));


mongo.connect("mongodb://gunnja:gunnja@ds123124.mlab.com:23124/fccmongo",(err, db) => {
  if (err) throw err
  else console.log("db connection successful")
  collect = db.collection('myColl');
// db.close();
});

// Get new urls
app.get(/^\/(http\:\/\/|https\:\/\/).+/, function (req, res) {
  let exists = dbExists(collect,req.path,function(num) {
    console.log("dbExists:",num);
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
  
// Redirect existing shortened urls
app.get(/\d+/, function (req, res) {
  dbFind(collect,req.path,function(path) {
    if (path) {
      res.redirect(path.substring(1));
    } else {
    console.log("getPath:", "error")
    }  
  })
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

