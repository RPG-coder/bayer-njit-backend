<h1 align=center>Bayer Patient Finder (PF)</h1>
<h4 align=center>API-Backend</h4>

## Quick Links
- [Licence](#licence)
- [Description](#description)
  - [Features](#features)
  - [Design](#design)
- [Requirements](#requirements)
- [Installation](#installation)
- [$ npm install](#-npm-install)
  - [Configure your database](#configure-your-database)
  - [Migrate you database by Sequilize ORM & CLI](#migrate-you-database-by-sequilize-orm-cli)
  - [Running the application](#running-the-application) 
- [Automate Installation process: Updates coming soon](#automate-installation-process-updates-coming-soon)

## Licence
This project is worked over by the student at NJIT, to satisfy the requirements for the Research Assistanship under guidance of Prof. Zhi Wei. The usage of the project for other means are currently limited. The Licence file is under review and is generated soon.

<!--For more details please see the <LicenceFileName_here...> (Coming Soon...)-->

## Description
A Patient Finder application that is used for finding percentage (%) population of patients who are dealing with a set of medical conditions while taking treatments or medication cures. The data for these could be collected from over a range of states and it is analysed by this application to determine which particular conditions and which particular product are more highlighted by the trends in data.

### Features
 1. User Authentication: Each time a user gets logged into their account they are generated with a unique accessToken. This user accessToken can be sent to as a authorization mechanism for every action they perform on their account and data accesses. If the access token is mismatch from what's in the database, then the Backend API must not carry out that request as they are marked as Unauthorized Action by default.
 2. Preferences: A FormSettings configurations that are manually saved by a user, so that users can default certain settings like a template rather than filling the long form from scratch. This is a means for users to efficiently work with the Patient Finder application, gaining a bonus interface experience.
 3. History: A FormSetting configuration that are stored automatically when a user clicks for graph generation (or data visualization) so that the potential product owner or respective users of the application can track what they have accessed across their product usage. 

### Design
[Bayer Patient Finder Design](https://wireframes.rahulgputcha.live/bayer/)

## Requirements
- SQL Version 13.0.5
- Node.js: 14.17.0
- Sequelize CLI: v6.2.0, ORM: v6.7.0
 
## Installation
### $ npm install
This application requires certain dependencies to be installed before running the application. These can be installed using:

  `$ npm install`

### Configure your database
Having mysql installed and started for database query requests, we need to configure the **config/config.json file**. This file should contain you MySQL database credentials and this database must come with a two pre-existing tables, namely **label_info** and **patient_info**. The tables from these must follow the schema supported by the application, thats also shared within the *Wireframe and Database design documentations*. Also capability of Sequelize ORM based database migration allows the application to be scalable using the power of [Sequelize-Auto](https://github.com/sequelize/sequelize-auto).

### Migrate you database by Sequilize ORM
This project comes with migration files set up to make the database setup easier and automated. The only requirement is to have a existing database with two files label_info and patients_info table containing data as described in the *Wireframe and Database design documentations* that will be shared with this application in the future. In order to migrate we are required to have Sequelize CLI installed that's also automatically done with npm install cmd. Using Sequelize-CLI we can perform:

  `$ npx sequelize-cli db:migrate:undo` # If you have previously migrated the last update

  `$ npx sequelize-cli db:migrate` # Save new updates
 
And watch the sql get migrated automatically into the database containing your label_info and patients_info table data.

### Running the application
To run this application on a localhost or as part of a hosted server, perform:

  `$ npm start` # Note at current stage this project is under development and is currently run using Nodemon npm package

## Automate Installation process: Updates coming soon
The shell script and Docker Images to automate above installation process, for an easy and quick plug and play options are under development and are coming soon.
