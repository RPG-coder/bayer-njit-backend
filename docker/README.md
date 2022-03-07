# ReadMe Manual for CKD Patient Navigator system Start to End deployment 
###### Written by Rahul Gautham Putcha

Purpose: Complete deployment of CKD Patient Navigator system

- Docker Images are held in this [Google drive](https://drive.google.com/drive/folders/1T06iuKNVntf-rCRpvP1b5gWC8YJ_8OD4?usp=sharing)
- Download bayer-njit-ckd for Complete deployment options

## Description
This file contains instructions running the docker image as container for CKD Patient-Navigator.
This is a complete application for all kinds of deployments for CKD Patient-Navigator.

## Instructions:
1. What you need before running 

  - You are provided with
    - bayer-njit-ckd.tar (For Window & Ubuntu systems users)
    - bayer-njit-ckd-x86_64.tar (For Linux-x86_64 or MacOS users)
    - a **res** folder containing;
      - a couple of .sql files for setting database 
      - a couple of 'run.sh' ubuntu shell script for installing docker and running this system
    - README.md manual, Which you are viewing currently!!
 
  - You are also required to have a AWS account with complete access to
    - Creating EC2 instances
    - Creating EC2 Security groups
    - Creating, Accessing RDS instances
    - Creating, Accessing S3 bucket

  - For the sake of simplicity for setting up account, we are opting to have the user with an Administrator access over AWS account.
  - For setting up an Administrator access user account with programmatic access key, 
    - Please visit [1. Tutorial - Create User with Access Key Credentials (Under production|Coming soon)]().

2. Install Docker Desktop or Docker-CLI
  - For Ubuntu only
    - Open Terminal/CLI with <u>the current directory as the folder containing this README.md</u>.
    - Execute below line in the folder containing README.md:

      $ sudo sh ./run.sh # This will Install docker and also run the image as container

3. Loading the Docker image
  - \# Follow the instruction below: ignore lines starting with '#' as they are only for reference purposes
  - \# Execute the '$' command on terminal

    $ docker load < bayer-njit-backend.tar # This is for Ubuntu & Windows machines only

    $ docker load < bayer-njit-backend-x86_64.tar # This is for MacOS & Linux-x86_64 machines only


4. Running the CKD Patient-Navigator Deployment system 
  - For Ubuntu users

      $ docker run -it -v "C:/Users/rahul/Desktop/Rahul Files/RA_filesNJIT/DockerWorks/folder/_complete_ckd_app_deployment/res":/temp/ bayer-njit-ckd

  - Windows/Mac OS
    - Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
    - Open Terminal/CMD prompt (Warning!!: not Powershell!)
    - For Windows users:

      $ docker run -it -v "<location of folder containing the res folder>/res":/temp/ bayer-njit-ckd
      
      \# to get the location of the folder on Windows: 
  
      \# copy the folder pos from the address bar or copy file path from "filepath> (cmd-prompt command line)" on cmd-prompt

    - for MacOS users:

      $ docker run -it --platform linux/x86_64 -v "<location of folder containing the res folder>/res":/temp/ bayer-njit-ckd-x86_64

      \# to get the location of the folder use $ pwd cmd on Ubuntu or MacOS terminal

<hr/>

##### GIT source backend: https://www.github.com/RPG-coder
##### GIT source frontend: https://www.github.com/sp2728
###### Docker image creator: Rahul Gautham Putcha
###### Email: rp39@njit.edu

