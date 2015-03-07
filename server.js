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

app.get('/', function (request, response)
{
  response.send('No Service')
});

app.use(function(error, request, response, next)
{
  if(error)
  {
    console.log(error);

    switch(error.status)
    {
      case 401:
        response.status(error.status).send({status: error.status, message: 'INVALID_TOKEN_UNAUTHORIZED', type:'authorization'});
        break;
      case 500:
        if(error.message !== false)
          response.status(500).send({status:500, message: error.message, type:'process'});
      default:
        response.status(500).send({status:500, message: 'internal error', type:'internal'});
    };
  }
});

var server = app.listen(3000, function ()
{
  var host = server.address().address
  var port = server.address().port
  console.log('Application started at http://localhost:%s/', port);
});
