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

function dbFind(collection,id,res) {
  let promFind = new Promise(function(resolve, reject) {
    let idNum = id.substring(1);
    collection.findOne({ 'quickID' : { $eq: parseInt(idNum) }}, function(err, item) {
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

function finder(collection, queryObj) {
    return collection.find(queryObj);
}

function handler(collection, req, queryObj) {
	if (queryObj != {}) {
		let promDigit = new Promise(function(resolve, reject) {
			resolve(finder(collection, queryObj).count());
		});
		promDigit.then(function(count) {
			console.log("dbExists:",count);
			if (count > 0) {
				console.log("already exists");
				database.close;
			} else {
				return handler(collection, req, {})
			}
		});
	} else {
		let promURL = new Promise(function(resolve, reject) {
			resolve(finder(collection, queryObj).count())
		});
		promURL.then(function(count) {
			let obj = {'quickID' : count, 'path' : req.path.substring(1)};
			console.log("createObj",obj);
			return obj;
		}).then(function(collection, obj) {
			console.log("new entry");
			dbInsert(collection, obj);
			console.log(obj);
			database.close;
		});
	}
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
  handler(collect, req, {
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
  dbFind(collect,req.path.substring(1),res)
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

