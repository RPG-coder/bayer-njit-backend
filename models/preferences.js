'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Preferences extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Preferences.init({
    userid: DataTypes.STRING,
    saveName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Preferences',
  });
  return Preferences;
};