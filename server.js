// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
 
app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file 
  
  // req.body will hold the text fields, if there were any 
})

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.post("/open_file", function (req, res) {
  res.send({"size":req.headers.'content-length'});
    //console.log(res);
});




// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});