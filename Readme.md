<h1 align=center>Bayer Patient Finder (PF)</h1>
<h4 align=center>API-Backend</h4>

## Quick Links

## Licence
- Under <Licence_here...>
- For more details please see the <LicenceFileName_here...> (Coming Soon...)

## Description
This repository provides the essentials for Bayer's API-Backend. More details about the API is shared on (Bayer PF API Documentation)['#patient-finder-doc-link'] <= Link coming soon

## Requirements
- Sequelize CLI [Node.js: 14.17.0, CLI: 6.2.0, ORM: 6.7.0]
- 
 
## Installation
### Configure your database
- Store your MySQL Database credentials inside ./config/config.json

### $ npm install
- Download all dependencies

### Auto-migrate your existing database with Sequelize Auto
- If there are any changes to the schema of the two databases, namely patient_info and label_info; Use the following commands to auto migrate the schema from your existing database named patient_database, hosted on localhost (say).

$ npx sequelize-auto -h localhost -d patient_database -u rahul -x PASSword@123 --dialect mysql -c ./config/config.json -o ./models -t patients_info \
$ npx sequelize-auto -h localhost -d patient_database -u rahul -x PASSword@123 --dialect mysql -c ./config/config.json -o ./models -t label_info

For more information about sequelize-auto, please visit [Sequelize Auto](https://github.com/sequelize/sequelize-auto)

### Automate Installation: Updates coming soon
- The shell script and Docker Images to automate above installation process are coming soon.