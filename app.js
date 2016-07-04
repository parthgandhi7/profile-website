var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');
var port = process.env.PORT || 3000;
var cloudantUserName = 'theastudedondarmstareers';
var cloudantUserPassword = '94b9f5e859098bda696cfe3e21f76bde9ed0a09c';
var dbUrl = 'http://'+cloudantUserName+':'+cloudantUserPassword+'@parthdev.cloudant.com/profile_app_db'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
var nodemailer = require('nodemailer');
//Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
var smtpTrans = nodemailer.createTransport('SMTP', {
    service: 'gmail',
    auth: {
      user: "parth.gandhi7@gmail.com",
      pass: "hiiwwtfuzxzpmxvr" 
    }
});
app.get('/', function(req, res) {
  console.log(__dirname);
  res.render('index.html');
});

app.post('/sendmail', function(req, res){

  var mailOpts = {
      to: 'parth.gandhi7@gmail.com',
      subject: req.body.name + ' | Website contact form',
      text: 'From : ' + req.body.email + ' : ' + req.body.message
  };

  smtpTrans.sendMail(mailOpts, function (error, response) {
      if(error){
        return res.status(500).send(error);
      }
    return res.json({"message": "Email has been sent successfully."});
  });
});

app.get('/', function(req, res) {
  res.json({"port": port});
});
app.post('/invite/user', function(req,res) {
  var timestamp = (new Date()).getTime();
  var user = {
    _id: 'user_' + timestamp,
    type: 'user',
    email: req.body.email,
    created_at: new Date(),
    updated_at: new Date()
  };
  request.post({url: dbUrl, json: user}, function(err, response, body) {
    return res.json({"message": "Thanks for registering. You would be notified soon."});
  })
});
// app.listen(process.env.PORT || 3000);
app.listen(port, function() {
    console.log("Listening on port - ", port);
});