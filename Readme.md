<h1 align=center>Bayer Patient Finder (PF)</h1>
<h4 align=center>API-Backend</h4>
<h6 align=center>This Branch is used for Production Mode only</h6>

## Quick Links
- [Licence](#licence)
- [Description](#description)
  - [Features](#features)
  - [Design & Documentations](#design--documentations)
- [Requirements](#requirements)
- [Installation](#installation-for-development--testing-only)
  - [Download this repo using git](#download-this-repository-using-git)
  - [$ npm install](#-npm-install)
  - [Configure your database](#configure-your-database)
  - [Migrate your database by Sequilize ORM & CLI](#migrate-your-database-by-sequilize-orm)
  - [Running the application (For development purposes only)](#running-the-application-for-development-purposes-only) 
  - [Testing the application (For development & testing purposes only)](#testing-the-application-for-development-and-testing-purposes-only) 
- [Automate Installation process using Docker](#automate-installation-process-using-docker)

## Licence
This project is worked over by the student of NJIT, for the Research Assistant job role under Prof. Zhi Wei. The Licence file is under review and is generated soon.

<!--For more details please see the <LicenceFileName_here...> (Coming Soon...)-->

## Description
A Patient Finder application is used for finding percentage (%) population of patients who are dealing with a set of medical conditions while taking treatments or medication cures. The data for these could be collected from over a range of states and it is analysed by this application to determine which particular conditions and which particular product are more highlighted by the trends in data.

### Features
 1. **User Authentication and Authorizations**: Every time a user log's into their account, they are generated with a unique accessToken. This accessToken is given to the users for validating their authorization pass for every action they perform on their account, including the data accesses. If the access token is mismatch from what's in stored in the database during generation, then the Backend API must not carry out that request as they are marked as Unauthorized Action by default.
 2. **Preferences**: All Graphical form configurations can be manually saved by authenticated users. Likewise, users have ability to view certain saved form settings like a template/shortcut without going through the hassle of filling a long form of patient requirement queries from scratch on every search performed. This gives users an efficient way work with the Patient Finder application, gaining a great interface experience.
 3. **History**: All Graphical form configuration can be stored automatically whenever a user performs actions for graph generation (or data visualization). This is a tracking feature and can be useful in several ways: 
    - To get an analytical understanding of the patient search pattern for individual user or group of all users
    - To get an track the usage of business critical data for security reasons
    - Provides individual user an ability to track their search history from the beginning; at point after their account creation.

### Design & Documentations
- [See Front end design on Page 3](https://github.com/RPG-coder/bayer-njit-backend/blob/master/documentation/Bayer_Backend_Design_Documentationv2.pdf)
- [See Back end design on Pages 1-2 & 4-6](https://github.com/RPG-coder/bayer-njit-backend/blob/master/documentation/Bayer_Backend_Design_Documentationv2.pdf)
- [Bayer - CKD Navigator Backend Deployment Manual](https://github.com/RPG-coder/bayer-njit-backend/blob/master/documentation/Bayer%20-%20CKD%20Navigator%20Backend%20Deployment%20Manual%20v2022.2.10.pdf)
- For reference on request & response format of Backend API, please refer to the [API Documentation](https://github.com/RPG-coder/bayer-njit-backend/blob/master/documentation/API_Documentation_for_Bayer_Patient_Finder.pdf)
- For examples on Backend API request & response format, please use [Postman application](https://www.postman.com/) and [Postman Backend API Testcase file](https://github.com/RPG-coder/bayer-njit-backend/tree/master/testing)
- All documentations pertaining the Bayer Patient Finder Application are present in [Bayer Documentation folder](https://github.com/RPG-coder/bayer-njit-backend/tree/master/documentation)

## Requirements
- SQL Version 13.0.5
- Node.js: 14.17.0
- Sequelize CLI: v6.2.0, ORM: v6.7.0
 
## Installation (For Development & Testing only)
### Download this repository using Git
  `$ git clone https://github.com/RPG-coder/bayer-njit-backend.git # For Development and Testing purposes only`
  
### $ npm install
This application requires certain dependencies to be installed before running the application; We also need Node.JS and npm installed before hand. The requirements can be installed using:

  `$ npm install`

### Configure your database
Having the mysql database application installed and upon starting a mysql endpoint server for database query requests, we need to configure the **config/config.json file**. This file should contain your MySQL database credentials. 

Also, The database must come with a two pre-existing tables, namely **label_info** and **patient_info**. The import can be done using following lines of commands:

 `$ mysql -h <<hostaddress>> -u <<username>> --password=<<password>> < label_info.sql`
 
 `$ mysql -h <<hostaddress>> -u <<username>> --password=<<password>> < patients_info.sql`
 
 For more details please refer to the [Backend Deployment Manual](https://github.com/RPG-coder/bayer-njit-backend/blob/master/documentation/Bayer%20-%20CKD%20Navigator%20Backend%20Deployment%20Manual%20v2022.2.10.pdf).
 
*NOTE: You are required to have a label_info.sql and patients_info.sql file in the directory fron where these lines are being called in the terminal.*

These tables must follow the schema shown in Page 2 of [Bayer_Backend_Design_Documentationv2.pdf](https://github.com/RPG-coder/bayer-njit-backend/blob/master/documentation/Bayer_Backend_Design_Documentationv2.pdf) document.


### Migrate your database by Sequilize ORM
This project also comes with migration files for an easier and automated database setup. The only requirement is to have a existing database with two tables label_info and patients_info table following the schema as described in the *Bayer_Backend_Design_Documentationv2.pdf* document. In order to migrate we are required use the Sequelize. This is automatically done with `npm install` command. After installing the dependencies, use Sequelize-CLI to migrate the database:

  `$ npx sequelize-cli db:migrate:undo` # If you have previously migrated the last update

  `$ npx sequelize-cli db:migrate` # Save new updates
 
And watch for all mysql tables getting migrated automatically into the database containing your label_info and patients_info table data.

### Running the application (For Development purposes only)
To run this application on a localhost, execute below line:

  \# WARNING: THIS SERVER MAY SHUTDOWN IF THE TERMINAL OR THE SYSTEM IS CLOSED | NOT FOR PRODUCTION PURPOSES
  
  `$ npm start`  # This will start a server that resembles the actual server 
  
For switching this application to production mode please refer to the [Backend Deployment Manual](https://github.com/RPG-coder/bayer-njit-backend/blob/master/documentation/Bayer%20-%20CKD%20Navigator%20Backend%20Deployment%20Manual%20v2022.2.10.pdf) in the documentation.
  
### Testing the application (For Development and Testing purposes only)
To run this application on localhost with Logging mode activated on for development & testing purposes, execute below line:

  `$ npm test` # This will activate logging mode and give in details on each route activity performed on the server

## Automate Installation process using Docker
All Docker Images are provided inside the **docker** folder of branch [sequelize-compatibility](https://github.com/RPG-coder/bayer-njit-backend/tree/sequelize-compatibility).

## Frontend: [Bayer CKD Population Navigator frontend](https://github.com/sp2728/bayer-njit-frontend)