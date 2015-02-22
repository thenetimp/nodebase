module.exports = function(app, db, jwt, jwtSecret)
{
  var password = require('../../lib/password');

  app.get('/api/user/create', function (req, res)
  {
    var user = db.User;
    console.log(password.crypt("Test12345678910"));
    res.send('Hello World!')
  });

  app.get('/api/user/authenticate', function (req, res)
  {

    // Perform authentication here.

    token = jwt.sign({
      username: "thenetimp2000@yahoo.com"
    }, jwtSecret);

    res.send({token: token});

  });

  app.get('/api/user/profile', function (req, res)
  {

    profile = {
      "firstName": "John",
      "lastName": "Doe"
    }

    res.send(profile);

  });
}