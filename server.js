var express = require('express');
var app = express();
var fs = require('fs');
var db = require('./models');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var postData = require('body-parser');
var validator = require('validator');


app.use(postData.json());
app.use(postData.urlencoded({extended: true}));

// Store this elsewhere later.
var jwtSecret = "asdasfasdfawefasdfawefas";
anonymousPaths = [
  '/api/user/authenticate',
  '/api/user/create',
  '/api/user/password-recovery-token',
  '/api/user/password-recovery'
];


app.use(expressJwt({secret: jwtSecret}).unless({path: anonymousPaths}));

// Bootstrap controllers
var controllersPath = __dirname + '/controllers';
var controllerFiles = fs.readdirSync(controllersPath);
controllerFiles.forEach(function(file){
  require(controllersPath+'/'+file)(app, db, jwt, jwtSecret, validator);
});

app.get('/', function (req, res)
{
  res.send('No Service')
});

app.use(function(err, req, res, next)
{
  console.log(err);
  switch(err.status)
  {
    case 401:
      res.send(err.status, {status: err.status, message: err.message, type:'authorization'});
      break;
    default:
      res.send(err.status, {status:500, message: 'internal error', type:'internal'});
  };
});

/*
app.use(function(err, req, res, next)
{
  var status, message = null;
  switch(err.status)
  {
    case 401:
      status = err.status;
      message = err.name + ": " + err.code;
      break;
    default:
      status = 500;
      message = "Something is broken, we'll be looking into it.";
  };

  errorResponse = {
    error: true,
    status: err.status,
    message: message
  };

  console.log("error: ");
  console.error(errorResponse);

  res.status(status).send(errorResponse);
});
*/

var server = app.listen(3000, function ()
{
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
});
