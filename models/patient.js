'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Patient.init({
    patid: {
        type: DataTypes.BIGINT,
        primaryKey: true
      },
      medical_condition: {
        type: DataTypes.BIGINT
      },
      treatment: {
        type: DataTypes.BIGINT
      },
      ip_mi: {
        type: DataTypes.INTEGER
      },
      ip_stroke: {
        type: DataTypes.INTEGER
      },
      ip_hf: {
        type: DataTypes.INTEGER
      },
      ip_cv: {
        type: DataTypes.INTEGER
      },
      dial_dx: {
        type: DataTypes.INTEGER
      },
      px_trans: {
        type: DataTypes.INTEGER
      },
      dial_cpt_rev: {
        type: DataTypes.INTEGER
      },
      lab_hba1c: {
        type: DataTypes.INTEGER
      },
      lab_egfr: {
        type: DataTypes.INTEGER
      },
      lab_uacr: {
        type: DataTypes.INTEGER
      },
      lab_egfr_uacr: {
        type: DataTypes.INTEGER
      },
      pv_card: {
        type: DataTypes.INTEGER
      },
      pv_endo: {
        type: DataTypes.INTEGER
      },
      pv_gp: {
        type: DataTypes.INTEGER
      },
      pv_neph: {
        type: DataTypes.INTEGER
      },
      pv_urol: {
        type: DataTypes.INTEGER
      },
      px_dial: {
        type: DataTypes.INTEGER
      },
      sex: {
        type: DataTypes.STRING
      },
      race: {
        type: DataTypes.STRING
      },
      paytyp: {
        type: DataTypes.STRING
      },
      prdtyp: {
        type: DataTypes.STRING
      },
      state: {
        type: DataTypes.STRING
      },
      eligeff: {
        type: DataTypes.STRING
      },
      eligend: {
        type: DataTypes.STRING
      },
      ckd: {
        type: DataTypes.INTEGER
      },
      diab: {
        type: DataTypes.INTEGER
      },
      yob: {
        type: DataTypes.INTEGER
      },
      indexdt: {
        type: DataTypes.STRING
      },
      yr: {
        type: DataTypes.INTEGER
      },
      pat_age: {
        type: DataTypes.INTEGER
      },
      pop: {
        type: DataTypes.STRING
      },
      agegrp: {
        type: DataTypes.INTEGER
      },
      div1: {
        type: DataTypes.INTEGER
      },
      reg: {
        type: DataTypes.INTEGER
      }
  }, {
    sequelize,
    timestamps:false,
    tableName:'patients_info',
    modelName: 'Patient'
  });
  return Patient;
};