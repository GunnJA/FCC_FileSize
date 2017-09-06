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
function dbInsert(collection,data) {
  collection.insert(data, function(err, data) {
    if (err) throw err
  })
}

function dbFind(collection,id) {
  return new Promise(function(resolve, reject) {
    let idNum = id.substring(1);
    collection.find({
      quickID : { $eq: parseInt(idNum) }
    }).toArray(function(err, documents) {
      console.log("docs",documents);
      resolve(documents[0].path);
    });
  });
}

function finder(collection, queryObj) {
    return collection.find(queryObj).count();
}

function handler(collection, req, queryObj) {
	return new Promise(function(resolve, reject) {
		if (queryObj != {}) {
			finder(collection, queryObj).then(function(count) {
				console.log("dbExists:",count);
				if (count > 0) {
					console.log("already exists");
					database.close;
				} else {
					return handler(collection, req, {})
				}
			});
		} else {
			finder(collection, queryObj).then(function(count) {
				return new Promise(function(resolve, reject) {
					let obj = {'quickID' : count, 'path' : req.path};
					console.log("createObj",obj);
					resolve(obj);
				});
			}).then(function(collection, obj) {
				console.log("new entry");
				dbInsert(collection, obj);
				console.log(obj);
				database.close;
			});
		}
	})
}



// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));


mongo.connect("mongodb://gunnja:gunnja@ds123124.mlab.com:23124/fccmongo",(err, db) => {
  if (err) throw err
  else console.log("db connection successful")
  collect = db.collection('myColl');
  database = db;
// db.close();
});

// Get new urls
app.get(/^\/(http\:\/\/|https\:\/\/).+/, function (req, res) {
  handler(collect, req, {
    path : { $eq: req.path }
  })
})
  
// Redirect existing shortened urls
app.get(/\d+/, function (req, res) {
  dbFind(collect,req.path,function(path) {
    if (path) {
      res.redirect(path.substring(1));
      database.close;
    } else {
    console.log("getPath:", "error")
      database.close;
    }  
  })
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

