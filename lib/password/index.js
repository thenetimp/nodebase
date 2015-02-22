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

module.exports = password;