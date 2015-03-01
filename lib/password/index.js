var bcrypt = require('bcrypt');
var password = {};

password.crypt = function(password)
{
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

password.compare = function(password, hashPassword)
{
  return bcrypt.compareSync(password, hashPassword);
};

password.recoveryToken = function()
{
  var result = '';
  length = 35;
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}

module.exports = password;