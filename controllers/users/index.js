module.exports = function(app, db, jwt, jwtSecret, validator)
{

  var passwd = require('../../lib/password');

  app.post('/api/user/create', function (request, response)
  {
    try
    {
      // Create variables foreach input.
      var firstName, lastName, emailAddress, password, passwordConfirm, User;
      firstName = validator.trim(request.body.firstName);
      lastName = validator.trim(request.body.lastName);
      emailAddress = validator.trim(request.body.emailAddress);
      password = validator.trim(request.body.password);
      passwordConfirm = validator.trim(request.body.passwordConfirm);

      if(!validator.isEmail(emailAddress))
        throw new Error('ERROR_INPUT_VALDATION_EMAILADDRESS_INVALID');

      if(password != passwordConfirm)
        throw new Error('ERROR_INPUT_COMPARATOR_PASSWORD_INVALID');

      User = db.User;
      User.create({
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        password: passwd.crypt(password)
      }).then(function()
      {
        response.status(200).send({error: false, message: "SUCCESS_USER_CREATED"});
      }).error(function(error)
      {
        console.log(error);
        response.status(500).send({error: true, message: error.errors});
      });
    }
    catch (exception)
    {
      co
      response.status(500).send({error: true, message: error.errors});
    }


  });

  app.post('/api/user/authenticate', function (request, response)
  {
    try
    {
      var emailAddress, password;
      emailAddress = validator.trim(request.body.emailAddress);
      password = validator.trim(request.body.password);

      if(!validator.isEmail(emailAddress))
        throw new Error('ERROR_INPUT_VALDATION_EMAILADDRESS_INVALID');

      var User = db.User;
      User.find({
        where: { emailAddress: emailAddress}
      }).then(function(user)
      {
        try
        {
          if(!user)
            throw new Error('ERROR_CREDENTIALS_INVALID');

          if(!passwd.compare(password, user.password))
            throw new Error('ERROR_CREDENTIALS_INVALID');

          token = jwt.sign({username: emailAddress }, jwtSecret);
          response.send({error: false, message: "SUCCESS_USER_AUTHENTICATED", data: {token: token}});
        }
        catch (exception)
        {
          // For some reason we are unable to catch the error message from the throw
          // need to look into why that is happeninguntil then.
          response.status(500).send({error: true, message: 'ERROR_CREDENTIALS_INVALID'});
        }

      });
    }
    catch (exception)
    {
      response.status(500).send({error: true, message: exception});
    }
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
        if(!user)
          throw new Error('ERROR_INVALID_USER');

        // Build the profile from the user object
        profile = {
          "firstName": user.firstName,
          "lastName": user.lastName,
          "emailAddress": user.emailAddress
        }
        response.status(200).send(profile);
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
        where: { emailAddress: emailAddress}
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
          return;
        });
      });
    }
    catch (exception)
    {
      response.status(500).send({error: true, message: "Unable to generate a token"});
      return;
    }
  });

  app.post('/api/user/password-recovery', function(request, response)
  {
    try
    {
      var now, expireTime, User;
      User = db.User;

      User.find({
        where: {emailAddress: request.body.emailAddress}
      }).then(function(user)
      {
        now = new Date();
        nowtime = now.getTime()

        if(user.passwordRecoveryToken!= "" && user.passwordRecoveryToken == request.body.recoveryToken && nowtime > user.passwordRecoveryTokenExpire)
        {
          user.updateAttributes({
            password: password.crypt(request.body.password),
            passwordRecoveryToken: ""
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