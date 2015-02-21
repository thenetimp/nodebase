"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {

    migration.createTable('Users',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      countryId: DataTypes.INTEGER(),
      emailAddress: DataTypes.STRING,
      password: DataTypes.STRING,
      salt: DataTypes.STRING
    });

    done();
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done();
  }
};
