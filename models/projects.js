'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Projects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Projects.init({
    projectname: DataTypes.STRING,
    description: DataTypes.TEXT,
    startdate: DataTypes.DATE,
    enddate: DataTypes.DATE,
    image: DataTypes.STRING,
    technologies: DataTypes.ARRAY(DataTypes.DECIMAL)
  }, {
    sequelize,
    modelName: 'projects',
  });
  return Projects;
};