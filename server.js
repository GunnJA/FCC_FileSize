// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

//mongoose.Promise = global.Promise;
mongo.connect("mongodb://gunnja:gunnja@ds123124.mlab.com:23124/fccmongo",(err, database) => {
  if (err) return console.log(err)

  console.log(database);
});

const db = mongo.connection;

db.on("error", (err) => {
	console.error(`connection error: ${err}`);
});

db.once("open", () =>{
	console.log("db connection successful");
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
