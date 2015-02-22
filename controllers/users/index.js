module.exports = function(app, db)
{
  var password = require('../../lib/password');

  app.get('/api/user/create', function (req, res)
  {
    var user = db.User;
    console.log(password.crypt("Test12345678910"));
    res.send('Hello World!')
  });
}