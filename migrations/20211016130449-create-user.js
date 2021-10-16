'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Users', {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      userid: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isLogged: DataTypes.BOOLEAN,
      authToken: {
        type: DataTypes.STRING,
        /*allowNull: false,
        unique: true*/
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
    await queryInterface.dropTable('Users');
  }
};