var express = require('express');
var bodyParser = require('body-parser');
var multer  = require('multer')

var app = express();
var mailBody = {};

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data


app.get('/', function(request, response) {
  response.json(mailBody);
});

app.post('/mail', function(request, response) {
  // console.log(request.param('sender'));
  console.log(request.params);
  console.log(request.body);
  //mailBody = request.body;
  response.sendStatus(200);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
