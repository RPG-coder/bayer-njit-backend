'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('FormSettings', {
      userid: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'userid',
        }
      },
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      jsonData: {
        type: DataTypes.JSON,
        allowNull: false
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
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('FormSettings');
  }
};