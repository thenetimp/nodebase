module.exports = function(app, db, jwt, jwtSecret, postData)
{
  var password = require('../../lib/password');

  app.post('/api/user/create', function (request, response)
  {
    if(request.body.password != request.body.passwordConfirm)
    {
      response.status(500).send({error: true, message: "Password mismatch"});
    }

    var User = db.User;
    User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      countryId: request.body.countryId,
      emailAddress: request.body.emailAddress,
      password: password.crypt(request.body.password)
    }).then(function(){
      response().status(200).send({error: false, message: "User created"});
    }).error(function(error){
      response.status(500).send({error: true, message: error.errors});
    });
  });

  app.post('/api/user/authenticate', function (request, response)
  {
    var User = db.User;

    User.find({
      where: { emailAddress: request.body.emailAddress}
    }).then(function(user)
    {
      if(!password.compare(request.body.password, user.values.password))
      {
        response.status(500).send({error: true, message: "Invalid account credentials"});
      }
    });

    token = jwt.sign({
      username: request.body.emailAddress
    }, jwtSecret);

    tokenResponse = {
      error: false,
      message: "User Authenticated",
      data: {
        token: token
      }
    };

    response.send(tokenResponse);
  });

  app.get('/api/user/profile', function (request, response)
  {
    try
    {
      var User = db.User;
      User.find({
        where: { emailAddress: request.user.username}
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
          response.status(200).send(profile);
        }

        response.status(500).send({error: true, message: "Unable to find user"});
      });
    }
    catch (exception)
    {
      response.status(500).send({error: true, message: "Unable to find user"});
    }
  });

  app.post('/api/user/password-recovery-token', function(request, response)
  {
    try
    {
      var now, expireTime, User;
      User = db.User;

      User.find({
        where: { emailAddress: request.body.emailAddress}
      }).then(function(user)
      {
        now = new Date();
        expireTime = now.getTime() + 86400;
        user.updateAttributes({
          passwordRecoveryToken : password.recoveryToken(),
          passwordRecoveryTokenExpire : expireTime
        }).then(function()
        {
          response.status(200).send({error: false, message: "token emailed"});
        });
      });
    }
    catch (exception)
    {
      response.status(500).send({error: true, message: "Unable to generate a token"});
    }
  });

  app.post('/api/user/password-recovery', function(request, response)
  {
    try{

      var now, expireTime, User;
      User = db.User;

      User.find({
        where: {emailAddress: request.body.emailAddress}
      }).then(function(user)
      {
        now = new Date();
        nowtime = now.getTime()

        if(user.passwordRecoveryToken == request.body.recoveryToken && nowtime > user.passwordRecoveryTokenExpire)
        {
          user.updateAttributes({
            password: password.crypt(request.body.password)
          });
          response.status(200).send({error: false, message: "password changed"});
          return;
        }
        response.status(500).send({error: true, message: "Password token invalid or expired"});
      });
    }
    catch (exception)
    {
      response.status(500).send({error: true, message: "Unable to process the password recovery token"});
    }
  });


}