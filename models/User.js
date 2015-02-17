"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    countryId: DataTypes.INTEGER(),
    emailAddress: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING
  });

  return User;
};