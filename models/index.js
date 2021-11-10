'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

let filenames = fs.readdirSync(__dirname).filter(file => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-9) === '.model.js');
})

filenames.forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

console.log('Loaded Database Tables:\n', db);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.PreferenceFormSettingsFK = ()=>{
  sequelize.query(`SELECT * FROM information_schema.REFERENTIAL_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME = 'FormSettings' AND CONSTRAINT_NAME = 'Preferences_ibfk_1' AND TABLE_NAME = 'Preferences'`, {type: Sequelize.QueryTypes.SELECT}).then((truth)=>{
    if(truth && truth.length>0){
      console.log("[INFO]: Preference is related to FormSettings",true);
    }else{
      sequelize.query("ALTER TABLE Preferences ADD CONSTRAINT Preferences_ibfk_1 FOREIGN KEY (userid,id) REFERENCES FormSettings(userid, id)").then((data)=>{
        console.log("[INFO]: New relation constraint is imposed on Preference and Foreign key", true);
      });
    }
  }).catch((err)=>{
    console.log('[ERROR]: Server error in setting the Preference & FormSettings relation');
    console.log(err)
  });
}

db.PreferenceFormSettingsFK();
module.exports = db;
