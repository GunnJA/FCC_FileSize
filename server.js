// server.js
// where your node app starts

// init project
const key = process.env.KEY;
const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient
const url = require('url');
const APIurl = "https://www.googleapis.com/customsearch/v1?"
const dbCollection = "fccsearch";
let database;
let collect;

// functions
function dbInsert(collection,obj,res) {
  collection.insert(obj, function(err, data) {
    if (err) throw err
    database.close;
    res.send({"Shortened URL": "https://urlshortener-10.glitch.me/" + obj.quickID});
  })
}

function finder(collection, queryObj) {
    return collection.find(queryObj);
}

function dbFind(collection,id,res) {
  let promFind = new Promise(function(resolve, reject) {
    collection.findOne({ 'quickID' : { $eq: parseInt(id) }}, function(err, item) {
      if (err) {
        throw err;
      } else if (item === null) {
         res.send({"error": "ID doesn't exist"});
      } else {
      resolve(item.path);
      }
    });
  })
  promFind.then(function(path) {
        console.log("path",path);
        if (path) {
          res.redirect(path);
          database.close;
        } else {
          database.close;
        }
    });
}

function promQuery(collection, queryObj) {
  return new Promise(function(resolve, reject) {
			resolve(finder(collection, queryObj).count());
		});
}

function exists(collection, req, res, queryObj) {
  return new Promise(function(resolve, reject) {
    promQuery(collection, queryObj).then(function(count) {
        console.log("dbExists:",count);
        if (count > 0) {
          reject(Error("already exists"))
          res.send({"error": "already exists"});
          database.close;
        } else {
          resolve(assignID(collection, req, res, {}));
        }
    })
  })
}

function assignID(collection, req, res, queryObj) {
  promQuery(collection, queryObj).then(function(count) {
      console.log("path", req.path.substring(1))
      let obj = {'quickID' : count, 'path' : req.path.substring(1)};
      console.log("createObj",obj);
      return obj;
  }).then(function(obj) {
      console.log("new entry");
      dbInsert(collection, obj, res);
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
app.get(/^\/(http\:\/\/|https\:\/\/).+/, function (req, res) {
  exists(collect, req, res, {
    path : { $eq: req.path.substring(1) }
  })
})

app.get("/urls", function(req, res) {
  let promRetr = new Promise(function (resolve, reject) {
    finder(collect,{}).toArray(function (err,data) {
      let urls = data;
      resolve(urls);
    });
  }).then(function(urls) {
    res.send(urls);
  })
});
  
// Redirect existing shortened urls
app.get(/\d+/, function (req, res) {
  let id = req.path.substring(1);
  dbFind(collect,id,res)
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});