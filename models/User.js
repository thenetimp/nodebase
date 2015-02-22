"use strict";

module.exports = function(sequelize, DataTypes){
  var User = sequelize.define("User", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryId: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set: function(val)
      {
        this.setDataValue('password', val);
      }
    }
  });

  return User;
};