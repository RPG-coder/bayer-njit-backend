/*********************************************************
 * Users Controller module
 * @module /controllers/users.controller.js
 * @version 1.28.2022
 * 
 * @author Rahul Gautham Putcha <rp39@njit.edu>
 * @contributors Jianlen Ren, Rahul Gautham Putcha, Jiawei Wang, Sai Kiran Pocham
 * @description contains core function for managing users in the CKB Navigation system
 * Functions included:
 * 1. register() - unsafe
 * 2. login() - unsafe
 * 3. logOut() - unsafe
 * 
 * safe - makes no changes in database, or atleast existing data.
 * unsafe - makes a change to the database
 * 
 * for more information on the API documentation please visit: 
*********************************************************/
/**
 * JSDOC setting type format for documentation purpose 
 * @typedef {{userid: string, authToken: string}} UserAuthorizationRequest
 * @typedef {{status: number, success: 1, data: any}} SuccessMessage
 * @typedef {{status: number, success: 0, message: string}} FailureMessage
 * @typedef {JSON} FuncParams
 * 
 * For more details check out, {@link } (API Docs)
 */

/* --- Import Files --- */
const database = require("../models");
const {v4} = require('uuid');
const { errorLogger, activityLogger } = require("../logs/logger");
const Users = database.User;

/**
 * Create a new user to the patient finder application and provides a way for a user to gain access to the patient finder database. 
 * Start logging user’s accesses for the database by the using of an unique authToken. (Security feature)
 * @param {JSON} req - request object with a body attribute,
 * @returns {{status: number, success: 1, userData: Object, message:String}|FailureMessage} a response object (Refer to documentation)
 **/
exports.register = async (req) => {
    /* Check if the request msg format is correct */
    if(req.body.email && req.body.userid && req.body.password && req.body.fullName){
        activityLogger.info(`Received request message ${JSON.stringify(req.body)} for an User Register\n`);
        
        /* Parse request msg and substitute required values */
        const registerDetails={
            fullName: req.body.fullName,
            userid: req.body.userid,
            password: req.body.password,
            email: req.body.email,
            isLogged: true,
            authToken: v4()
        };
        
        try{
            /* Create a new User as per what is provided in the request msg */
            const data = await Users.create(registerDetails);
            activityLogger.info(`[INFO]: Data received upon registering user ${registerDetails.userid} - \n ${JSON.stringify(data)}\n\n`);

            /* User is successfully created. Logging the new user into the Patient Finder application soon after the account creation. */
            const user = await Users.findByPk(registerDetails.userid);
            user.isLogged = true;
            await user.save(); await user.reload();

            /* Respond a SUCCESS msg */
            return {
                status: 200,
                success: user.isLogged | 0,
                userData: { /* The userData must be saved into the cookie of the frontend (client) application  */
                    userid: user.userid,
                    fullName: user.fullName, 
                    email: user.email, 
                    authToken: user.authToken
                },
                message: "You are now officialy registered!"
            };
            
        }catch(err){
            /* Logging all error */
            errorLogger.error({
                status: 401,
                success: 0,
                message: "UserID/Email is already taken.",
                error: err
            }, req.body);
            /* Respond a FAILURE msg */
            return {
                status: 401,
                success: 0,
                message: "UserID/Email is already taken.",
            };
        };
    }else{
        /* Logging all error */
        errorLogger.error({
            status: 400,
            signup: 0,
            message: "Bad Request",
            error: "Request message format unsupported"
        }, req.body);

        /* Respond a FAILURE msg */
        return {
            status: 400,
            signup: 0,
            message: "Bad Request",
            error: "Request message format unsupported"
        };
    }
};

/**
 * Provides a way for a user to gain access to the patient finder database. 
 * Start logging user’s accesses for the database by the using of an unique authToken. 
 * (Security feature) authToken expires after 1 day.
 * @param {JSON} req - request object with a body attribute, as specified in the Patient Finder API documentation
 * @returns {{status: number, success: 1, userData: Object, message: String}|FailureMessage} a response object (Refer to documentation)
**/
exports.login = async (req) => {
    
     activityLogger.info(`Received request message ${JSON.stringify(req.body)} for an User Login\n`);
    if(req.body.userid && req.body.password){
        activityLogger.info(`Received request message ${JSON.stringify(req.body)} for an User Login\n`);
        const loginDetails = {userid: req.body.userid, password: req.body.password};
        try{
            const user = await Users.findByPk(req.body.userid);

            if(user.password === loginDetails.password){ /* --- If user credentials are correct --- */
                /* Then, user is logged here... */
                user.isLogged = true;
                user.authToken = v4();
                await user.save(); await user.reload();

                return {
                    status: 200,
                    success: user.isLogged | 0,
                    userData: {
                        userid: user.userid,
                        fullName: user.fullName, 
                        email: user.email, 
                        authToken: user.authToken
                    },
                    message: "Login: Successful!" 
                };
            }else{
                errorLogger.error({
                    status: 401,
                    success: 0, 
                    message: "Invalid UserID/Password!"
                }, req.body);
                return {
                    status: 401,
                    success: 0, 
                    message: "Invalid UserID/Password!"
                };
            }
        } catch(err){
            const response = {
                status: 400,
                success: 0,
                message: "Bad Request",
            };
            if(err){
                response.status = 401,
                response.message = "Invalid UserID/Password!";
            }
            errorLogger.error(response, err, req.body);
            return response;
        };
        
    }else{
        errorLogger.error({
            status: 400,
            success: 0, 
            message: "Bad Request",
            error: "Request message format unsupported"
        }, req.body);
        return {
            status: 400,
            success: 0, 
            message: "Bad Request",
            error: "Request message format unsupported"
        };
    }
}


/**
 * Users will be logged out and the session will be ended. The user, upon logout, will no longer have their 
 * access until a new accessToken is generated by logging in.
 * @param {JSON} req - request object
 * @returns {{status: number, success: 1, message: String}|FailureMessage} a response object (Refer to documentation)
 **/
exports.logOut = async (req) => {
    if(req.body.userid && req.body.authToken){
        activityLogger.info(`Received request message ${JSON.stringify(req.body)} for an User Logout\n`);

        try{
            /* --- User logs out here... --- */
            const user = await Users.findByPk(req.body.userid);
            if(user.authToken!=null){
                user.isLogged = false;
                user.authToken = null;
                await user.save(); await user.reload();
                return {
                    status: 200,
                    success: !(user.isLogged) | 0,
                    message: "Logged out successfully!"
                };
            }else{
                errorLogger.error({
                    status: 401,
                    success: 0,
                    message: "Unauthorized command!"
                }, req.body);
                return {
                    status: 401,
                    success: 0,
                    message: "Unauthorized command!"
                };
            }

            
        }catch(err){
            errorLogger.error({
                status: 400,
                success: 0,
                message: "Bad Request",
                error: err
            }, req.body);
            return {
                status: 400,
                success: 0,
                message: "Bad Request",
            };
        }

    }else{
        errorLogger.error({
            status: 400,
            success: 0,
            message: "Bad Request",
            error: "Request message format unsupported"
        }, req.body);
        return {
            status: 400,
            success: 0,
            message: "Bad Request",
            error: "Request message format unsupported"
        };
    }
}