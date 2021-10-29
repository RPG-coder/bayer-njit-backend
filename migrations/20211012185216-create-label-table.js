'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('label_info', {
      name: {
        allowNull:false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      label_type: {
        type: Sequelize.STRING
      },
      label: {
        type: Sequelize.STRING
      },
      label_val: {
        type: Sequelize.BIGINT
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('label_info');
  }
};
