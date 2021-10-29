var DataTypes = require("sequelize").DataTypes;
var _label_info = require("./label_info");
var _patients_info = require("./patients_info");

function initModels(sequelize) {
  var label_info = _label_info(sequelize, DataTypes);
  var patients_info = _patients_info(sequelize, DataTypes);

  return {
    label_info, patients_info
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
