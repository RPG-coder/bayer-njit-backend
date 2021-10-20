'use strict';
const { sequelize, PreferenceFormSettingsFK } = require('../models');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Preferences', {
      userid: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
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
    });
    PreferenceFormSettingsFK();  
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('Preferences');
  }
};