var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var _ = require('lodash');

// Email adress which sends to all addresses in the ad hoc collection.
var triggerAddress = 'john.rothfels@gmail.com'

// Set your mailgun API key here.
var api_key = 'key-35d22fa46e85f8090bc8d205648d5588';
// var domain = 'johnrothfels.com.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: 'johnrothfels.com'});

var app = express();
var adHocCollection = {};

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

app.get('/', function(req, res) {
  res.json(adHocCollection);
});

app.get('/clear', function(req, res) {
  adHocCollection = {};
  res.send('All clear!');
})

var sendMessages = function(subject, text) {
  console.log('we are in send messages');
  _.forEach(_.keys(adHocCollection), function(recipient) {
    var data = {
      from: 'John Rothfels <me@johnrothfels.com>',
      to: recipient,
      subject: subject,
      text: text || ''
    };

    mailgun.messages().send(data, function(err, body) {
      if (err) {
        console.log("ERROR");
        console.log(err);
      } else {
        console.log('successfully sent message');
        console.log(body);
      }
    });
  });
};

app.post('/mail', function(req, res) {
  console.log('got mail');
  console.log(req.body);
  var sender = req.body.sender;
  if (sender === triggerAddress) {
    sendMessages(req.body.subject);
  } else {
    console.log('adding ' + sender + ' to collection');
    adHocCollection[req.body.sender] = true;
  }

  res.sendStatus(200);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
