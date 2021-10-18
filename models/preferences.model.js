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
      this.hasOne(models.FormSettings, {
        foreignKey: 'userid',
        targetKey: 'userid'
      });
    }
  };
  Preferences.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      references: {
        model: 'FormSettings',
        key: 'id',
      }, 
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    userid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'FormSettings',
        key: 'userid',
      }, 
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    saveName: {
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Preferences',
  });
  return Preferences;
};