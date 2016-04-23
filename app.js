var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
// var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
// var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var nodemailer = require('nodemailer');
//Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
var smtpTrans = nodemailer.createTransport('SMTP', {
    service: 'gmail',
    auth: {
      user: "parth.gandhi7@gmail.com",
      pass: "hiiwwtfuzxzpmxvr" 
    }
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
})
// app.listen(process.env.PORT || 3000);
app.listen(port, function() {
    console.log("Listening on port - ", port);
});