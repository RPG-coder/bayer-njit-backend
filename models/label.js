'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Label extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Label.init({
    name:{
      type: DataTypes.STRING,
      primaryKey: true
    },
    label_type: DataTypes.STRING,
    label: DataTypes.STRING,
    label_val: DataTypes.BIGINT,
  }, {
    sequelize,
    tableName:'label_info',
    timestamps: false,
    modelName: 'Label',
  });
  return Label;
};