// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// to send file size
app.post("/open_file", function (req, res) {
  let size = parseInt(req.headers["content-length"]);
  res.send({"size": size});
    //console.log(res);
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
