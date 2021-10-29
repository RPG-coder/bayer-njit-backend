const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('label_info', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    label_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    label: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    label_val: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'label_info',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
};
