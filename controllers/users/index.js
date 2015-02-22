module.exports = function(app, db, jwt, jwtSecret, postData)
{
  var password = require('../../lib/password');

  app.post('/api/user/create', function (req, res)
  {
    if(req.body.password != req.body.passwordConfirm)
    {
      res.status(500).send({error: true, message: "Password mismatch"});
    }

    var User = db.User;
    User.create({
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
    var User = db.User;

    User.find({
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
      var User = db.User;
      User.find({
        where: { emailAddress: req.user.username}
      }).then(function(user)
      {
        if(user)
        {
          profile = {
            "firstName": user.values.firstName,
            "lastName": user.values.lastName,
            "emailAddress": user.values.emailAddress,
            "countryId": user.values.countryId
          }
          res.status(200).send(profile);
        }

        res.status(500).send({error: true, message: "Unable to find user"});
      });
    }
    catch (exception)
    {
      res.status(500).send({error: true, message: "Unable to find user"});
    }
  });
}