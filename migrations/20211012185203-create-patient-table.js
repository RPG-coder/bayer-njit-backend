'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

     await queryInterface.createTable('patients_info', {
      patid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      medical_condition: {
        type: Sequelize.BIGINT
      },
      treatment: {
        type: Sequelize.BIGINT
      },
      ip_mi: {
        type: Sequelize.INTEGER
      },
      ip_stroke: {
        type: Sequelize.INTEGER
      },
      ip_hf: {
        type: Sequelize.INTEGER
      },
      ip_cv: {
        type: Sequelize.INTEGER
      },
      dial_dx: {
        type: Sequelize.INTEGER
      },
      px_trans: {
        type: Sequelize.INTEGER
      },
      dial_cpt_rev: {
        type: Sequelize.INTEGER
      },
      lab_hba1c: {
        type: Sequelize.INTEGER
      },
      lab_egfr: {
        type: Sequelize.INTEGER
      },
      lab_uacr: {
        type: Sequelize.INTEGER
      },
      lab_egfr_uacr: {
        type: Sequelize.INTEGER
      },
      pv_card: {
        type: Sequelize.INTEGER
      },
      pv_endo: {
        type: Sequelize.INTEGER
      },
      pv_gp: {
        type: Sequelize.INTEGER
      },
      pv_neph: {
        type: Sequelize.INTEGER
      },
      pv_urol: {
        type: Sequelize.INTEGER
      },
      px_dial: {
        type: Sequelize.INTEGER
      },
      sex: {
        type: Sequelize.STRING
      },
      race: {
        type: Sequelize.STRING
      },
      paytyp: {
        type: Sequelize.STRING
      },
      prdtyp: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      eligeff: {
        type: Sequelize.STRING
      },
      eligend: {
        type: Sequelize.STRING
      },
      ckd: {
        type: Sequelize.INTEGER
      },
      diab: {
        type: Sequelize.INTEGER
      },
      yob: {
        type: Sequelize.INTEGER
      },
      indexdt: {
        type: Sequelize.STRING
      },
      yr: {
        type: Sequelize.INTEGER
      },
      pat_age: {
        type: Sequelize.INTEGER
      },
      pop: {
        type: Sequelize.STRING
      },
      agegrp: {
        type: Sequelize.INTEGER
      },
      div1: {
        type: Sequelize.INTEGER
      },
      reg: {
        type: Sequelize.INTEGER
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
     await queryInterface.dropTable('patients_info');
  }
};
