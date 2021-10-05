/* -- Database Configuration -- */
const databaseConfig = require("../configs/database.config");
const Sequelize = require("sequelize");
const mysql = new Sequelize(databaseConfig.DB_NAME, databaseConfig.USER, databaseConfig.PASSWORD, {
    host: databaseConfig.HOST,
    dialect: databaseConfig.dialect
});
const databaseManager = {};
databaseManager.Sequelize = Sequelize;
databaseManager.mysql = mysql;

/* Table connectors */
databaseManager.accessTable = require("./user.model")(mysql, Sequelize);

/* -- Exports -- */
module.exports = databaseManager;
