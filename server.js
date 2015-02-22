var express = require('express');
var app = express();
var fs = require('fs');
var db = require('./models');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

// Store this elsewhere later.
var jwtSecret = "asdasfasdfawefasdfawefas";

app.use(expressJwt({secret: jwtSecret}).unless({path: ['/api/user/authenticate', '/api/user/create']}));

// Bootstrap controllers
var controllersPath = __dirname + '/controllers';
var controllerFiles = fs.readdirSync(controllersPath);

controllerFiles.forEach(function(file){
  require(controllersPath+'/'+file)(app, db, jwt, jwtSecret)
})


app.get('/', function (req, res)
{
  var user = db.User;
  console.log(password.crypt("Test12345678910"));
  res.send('Hello World!')
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
