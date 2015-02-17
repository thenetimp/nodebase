var db        = {};
var fs        = require("fs");
var path      = require("path");
var Sequelize = require('sequelize')
  , sequelize = new Sequelize('node_test', 'root', '', {
      dialect: "mysql", 
      port:    3306, 
    });
 
sequelize
  .authenticate()
  .complete(function(err) {
    if (!!err) {
      console.log('Unable to connect to the database:', err)
    } else {
      console.log('Connection has been established successfully.')
    }
  });

// Read the files in the models directory
// if it's not index.js then require it into the model
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    console.log("including: " + file);
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;