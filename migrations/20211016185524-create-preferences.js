'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Preferences', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
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
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Preferences');
  }
};