const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('patients_info', {
    patid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    medical_condition: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    treatment: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ip_mi: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    ip_stroke: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    ip_hf: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    ip_cv: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    dial_dx: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    px_trans: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    dial_cpt_rev: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    lab_hba1c: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    lab_egfr: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    lab_uacr: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    lab_egfr_uacr: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    pv_card: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    pv_endo: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    pv_gp: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    pv_neph: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    pv_urol: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    px_dial: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    sex: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    race: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    paytyp: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    prdtyp: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    eligeff: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    eligend: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ckd: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    diab: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    yob: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    indexdt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    yr: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    pat_age: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    pop: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    agegrp: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    div1: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    reg: {
      type: DataTypes.SMALLINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'patients_info',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "patid" },
        ]
      },
    ]
  });
};
