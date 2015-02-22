var express = require('express');
var password = require('./lib/password');
var db = require('./models');
var app = express();

app.get('/', function (req, res)
{

  var user = db.User;
  // console.log(user);
  console.log(password.crypt("Test12345678910"));


  res.send('Hello World!')
});

app.get('/api/user/create', function (req, res)
{
  var user = db.User;
  console.log(password.crypt("Test12345678910"));


  res.send('Hello World!')
});



var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
