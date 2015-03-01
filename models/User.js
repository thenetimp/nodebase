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
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set: function (val)
      {
        this.setDataValue('password', val);
      }
    },
    passwordRecoveryToken: {
      type: DataTypes.STRING,
      allowNull: true,
      set: function(val)
      {
        this.setDataValue('passwordRecoveryToken', val);
      }
    },
    passwordRecoveryTokenExpire: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });

  return User;
};