'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require("dotenv").config();
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'production';
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log(`Using environment "${env}"`); 
const config = require(__dirname + '/../config/config')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    dialectOptions: config.dialectOptions,
    port: config.port,
  });
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
