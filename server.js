var express = require('express');
var app = express();
var fs = require('fs');
var db = require('./models');

// Bootstrap controllers
var controllersPath = __dirname + '/controllers';
console.log(controllersPath);

var controllerFiles = fs.readdirSync(controllersPath);
console.log(controllerFiles);


controllerFiles.forEach(function(file){
  require(controllersPath+'/'+file)(app, db)
})


app.get('/', function (req, res)
{

  var user = db.User;
  // console.log(user);
  console.log(password.crypt("Test12345678910"));


  res.send('Hello World!')
});


var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
