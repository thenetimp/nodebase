module.exports = function(app, db, jwt, jwtSecret, validator)
{

  var passwd = require('../../lib/password');

  app.post('/api/user/create', function (request, response, next)
  {
    // Create the default error container
    var error = new Error();

    // Create variables foreach input.
    var firstName, lastName, emailAddress, password, passwordConfirm, User;
    firstName = validator.trim(request.body.firstName);
    lastName = validator.trim(request.body.lastName);
    emailAddress = validator.trim(request.body.emailAddress);
    password = validator.trim(request.body.password);
    passwordConfirm = validator.trim(request.body.passwordConfirm);

    if(!validator.isEmail(emailAddress))
    {
      error.status = 500; error.message = "ERROR_INVALID_EMAIL"; error.code = 101;
      return next(error);
    }

    if(password != passwordConfirm)
    {
      error.status = 500; error.message = "ERROR_INPUT_COMPARATOR_PASSWORD_INVALID";  error.code = 102;
      return next(error);
    }

    User = db.User;
    User.create({
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      password: passwd.crypt(password)
    }).then(function()
    {
      response.status(200).send({error: false, message: "SUCCESS_USER_CREATED"});
      return;
    }).error(function(error)
    {
      error.status = 500; error.message = "ERROR_UNABLE_TO_CREATE_USER";  error.code = 103;
      return next(error);
    });
  });

  app.post('/api/user/authenticate', function (request, response)
  {
    // Create the default error container
    var error = new Error();

    // Create variables foreach input.
    var emailAddress, password;
    emailAddress = validator.trim(request.body.emailAddress);
    password = validator.trim(request.body.password);

    if(!validator.isEmail(emailAddress))
    {
      error.status = 500; error.message = "ERROR_INPUT_VALDATION_EMAILADDRESS_INVALID"; error.code = 201;
      return next(error);
    }

    var User = db.User;
    User.find({
      where: { emailAddress: emailAddress}
    }).then(function(user)
    {
      if(!user)
      {
        error.status = 500; error.message = "ERROR_CREDENTIALS_INVALID"; error.code = 202;
        return next(error);
      }

      if(!passwd.compare(password, user.password))
      {
        error.status = 500; error.message = "ERROR_CREDENTIALS_INVALID"; error.code = 203;
        return next(error);
      }

      token = jwt.sign({username: emailAddress }, jwtSecret);
      response.send({error: false, message: "SUCCESS_USER_AUTHENTICATED", data: {token: token}});

    });
  });

  app.get('/api/user/profile', function (request, response)
  {
    // Create the default error container
    var error = new Error();

    var User = db.User;
    User.find({
      where: { emailAddress: request.user.username}
    }).then(function(user)
    {
      if(!user)
      {
        error.status = 500; error.message = "ERROR_INVALID_USER"; error.code = 301;
        return next(error);
      }

      // Build the profile from the user object
      profile = {
        "firstName": user.firstName,
        "lastName": user.lastName,
        "emailAddress": user.emailAddress
      }
      response.status(200).send(profile);
    });
  });

  app.post('/api/user/password-recovery-token', function(request, response)
  {
    // Create the default error container
    var error = new Error();

    // Create variables foreach input.
    var emailAddress, now, expireTime;
    emailAddress = validator.trim(request.body.emailAddress);

    if(!validator.isEmail(emailAddress))
    {
      error.status = 500; error.message = "ERROR_INPUT_VALDATION_EMAILADDRESS_INVALID"; error.code = 401;
      return next(error);
    }

    var User = db.User;

    User.find({
      where: { emailAddress: emailAddress}
    }).then(function(user)
    {
      if(!user)
      {
        error.status = 500; error.message = "ERROR_INVALID_USER"; error.code = 402;
        return next(error);
      }

      now = new Date();
      expireTime = now.getTime() + 86400;
      user.updateAttributes({
        passwordRecoveryToken : passwd.recoveryToken(),
        passwordRecoveryTokenExpire : expireTime
      }).then(function()
      {
        response.status(200).send({error: false, message: "SUCCESS_TOKEN_EMAILED"});
      });
    });
  });

  app.post('/api/user/password-recovery', function(request, response)
  {
    // Create the default error container
    var error = new Error();
    var now, expireTime, emailAddress, recoveryToken, password, passwordConfirm;
    var User = db.User;

    // Create variables foreach input.
    emailAddress = validator.trim(request.body.emailAddress);
    recoveryToken = validator.trim(request.body.recoveryToken);
    password = validator.trim(request.body.password);
    passwordConfirm = validator.trim(request.body.passwordConfirm);

    if(!validator.isEmail(emailAddress))
    {
      error.status = 500; error.message = "ERROR_INPUT_VALDATION_EMAILADDRESS_INVALID"; error.code = 501;
      return next(error);
    }


    User.find({
      where: {emailAddress: emailAddress}
    }).then(function(user)
    {
      now = new Date();
      nowtime = now.getTime()


      if(!user)
      {
        error.status = 500; error.message = "ERROR_INVALID_TOKEN_OR_TOKEN_EXPIRED"; error.code = 501;
        return next(error);
      }

      if(user.passwordRecoveryToken == "" || user.passwordRecoveryToken != request.body.recoveryToken || nowtime < user.passwordRecoveryTokenExpire)
      {
        error.status = 500; error.message = "ERROR_INVALID_TOKEN_OR_TOKEN_EXPIRED"; error.code = 501;
        return next(error);
      }

      user.updateAttributes({
        password: password.crypt(password),
        passwordRecoveryToken: ""
      }).then(function()
      {
        response.status(200).send({error: false, message: "SUCCESS_PASSWORD_CHANGED"});
      });
    });
  });
}