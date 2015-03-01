"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {

    migration.createTable('Users',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      emailAddress: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      passwordRecoveryToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      passwordRecoveryTokenExpire: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updatedAt: DataTypes.DATE,
      createdAt: DataTypes.DATE
    });

    done();
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done();
  }
};
