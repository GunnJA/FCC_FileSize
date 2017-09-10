// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient
const url = require('url');
let database;
let collect;


// functions
function dbInsert(collection,obj) {
  console.log("coll:",collection);
  collection.insert(obj, function(err, data) {
    if (err) throw err
    console.log(data);
    database.close;
  })
}

function finder(collection, queryObj) {
    return collection.find(queryObj);
}

function dbFind(collection,id,res) {
  let promFind = new Promise(function(resolve, reject) {
    collection.findOne({ 'quickID' : { $eq: parseInt(id) }}, function(err, item) {
      if (err) throw err;
      resolve(item.path);
    });
  })
  promFind.then(function(path) {
        console.log("path",path);
        if (path) {
          res.redirect(path);
          database.close;
        } else {
        console.log("getPath:", "error")
          database.close;
        }
    });
}

function promQuery(collection, queryObj) {
  return new Promise(function(resolve, reject) {
			resolve(finder(collection, queryObj).count());
		});
}

function exists(collection, req, queryObj) {
  return new Promise(function(resolve, reject) {
    promQuery(collection, queryObj).then(function(count) {
        console.log("dbExists:",count);
        if (count > 0) {
          reject(Error("already exists"));
          database.close;
        } else {
          resolve(assignID(collection, req, {}));
        }
    })
  })
}

function assignID(collection, req, queryObj) {
  promQuery(collection, queryObj).then(function(count) {
      console.log("path", req.path.substring(1))
      let obj = {'quickID' : count, 'path' : req.path.substring(1)};
      console.log("createObj",obj);
      return obj;
  }).then(function(obj) {
      console.log("new entry");
      dbInsert(collection, obj);
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
  collect = db.collection('fcccoll');
  database = db;
// db.close();
});

// Get new urls
app.get(/^\/(http\:\/\/|https\:\/\/).+/, function (req, res) {
  exists(collect, req, {
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