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
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      countryId: DataTypes.INTEGER(),
      emailAddress: {
        type: DataTypes.STRING,
        unique: true
      },
      password: DataTypes.STRING,
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
