module.exports = function(app, db, jwt, jwtSecret, postData)
{
  var password = require('../../lib/password');

  app.post('/api/user/create', function (req, res)
  {
    if(req.body.password != req.body.passwordConfirm)
    {
      res.status(500).send({error: true, message: "Password mismatch"});
    }

    var user = db.User;
    user.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      countryId: req.body.countryId,
      emailAddress: req.body.emailAddress,
      password: password.crypt(req.body.password)
    }).then(function(){
      res.status(200).send({error: false, message: "User created"});
    }).error(function(error){
      res.status(500).send({error: true, message: error.errors});
    });
  });

  app.post('/api/user/authenticate', function (req, res)
  {
    var user = db.User;

    user.find({
      where: { emailAddress: req.body.emailAddress}
    }).then(function(user)
    {
      if(!password.compare(req.body.password, user.values.password))
      {
        res.status(500).send({error: true, message: "Invalid account credentials"});
      }
    });

    token = jwt.sign({
      username: req.body.emailAddress
    }, jwtSecret);

    tokenResponse = {
      error: false,
      message: "User Authenticated",
      data: {
        token: token
      }
    };

    res.send(tokenResponse);
  });

  app.get('/api/user/profile', function (req, res)
  {
    try
    {
      var user = db.User;
      user.find({
        where: { emailAddress: req.user.username}
      }).then(function(result)
      {
        profile = {
          "firstName": result.values.firstName,
          "lastName": result.values.lastName,
          "emailAddress": result.values.emailAddress,
          "countryId": result.values.countryId
        }

        res.status(200).send(profile);

      });
    }
    catch (exception)
    {
      res.status(500).send({error: true, message: "Unable to find user"});
    }
  });
}