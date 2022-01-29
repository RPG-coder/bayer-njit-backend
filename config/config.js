const config = {
  "development": {   
    "username": process.env.MYSQL_DEV_USER,
    "password": process.env.MYSQL_DEV_PASSWORD,
    "database": "patient_database",
    "host": process.env.MYSQL_DEV_HOST,
    "port": 3306,
    "dialect": "mysql"
  },
  "test": {
    "username": process.env.MYSQL_TEST_USER,
    "password": process.env.MYSQL_TEST_PASSWORD,
    "database": "patient_database",
    "host": process.env.MYSQL_TEST_HOST,
    "port": 3306,
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.MYSQL_PROD_USER,
    "password": process.env.MYSQL_PROD_PASSWORD,
    "database": "patient_database",
    "host": process.env.MYSQL_PROD_HOST,
    "port": 3306,
    "dialect": "mysql",
    "logging": false
  }
}

module.exports = config