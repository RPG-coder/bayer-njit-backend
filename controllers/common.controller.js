/**
 * Common Controller Module
 * @module /controllers/common.controller.js
 * 
 * @author Rahul Gautham Putcha <rp39@njit.edu>
 * @contributors Jianlen Ren, Rahul Gautham Putcha, Jiawei Wang, Sai Kiran Pocham
 * @version 1.28.2022
 * @description Contains common code required by all controllers.
 * 
 * Functions included:
 * - checkCredentials - For checking if the user has proper authorization credentials for accessing resources.
 */

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
const {errorLogger} = require('../logs/logger');

/**
 * Check if user can access a resource with their credentials
 * @param {JSON} req - request msg, an extention of type UserAuthorizationRequest message 
 * @returns {Boolean} true if ACCESS_GRANT false if ACCESS_DENIED
 */
const checkCredentials = async (req)=>{
    /** @type {UserAuthorizationRequest} */
    let request;

    try{
        /* 
            Decide whether the message is inside query or body
            - Delete and get are both requesting using query parameters
            - Post and Put are both requesting using message body 
        */
        request = (req.method.toLowerCase() === "get" || req.method.toLowerCase() ==='delete')?req.query:req.body;
        const user = await database['User'].findOne({where:{userid: request.userid}});
        return (user && user.authToken===request.authToken);
    }catch(err){
        errorLogger.error(`[ERROR]: CheckCredentials Error`,err);
        return false;
    }
}

/**
 * Safely process requests to generate response considering all forms of errors
 * @param {FuncParams} params 
 * @param {Function} processHandler - handler to function that does action after performing authorization check. Syntax: async (params)=>{...code...}
 * @returns {SuccessMessage|FailureMessage} response
 * 
 * For more details check out, {@link } (API Docs)
 */
 const safelyProcessRequestMSG = async (params, processHandler)=>{
    /* CHECK IF user has proper access credentials for perform the route action requested */
    if( await checkCredentials(params.req) ){
        // If they do ...
        try{ // Safely execute the action handling errors

            /* Send SUCCESS Response msg */
            return {
                status: 200, 
                success:1, 
                data: await processHandler(params)
            };

        } catch(err){ 
            /* Log Errors & Send FAILURE Response msg */
            errorLogger.error({
                status: 500,
                success: 0,
                message: "Internal Server Error!", 
                error: err
            }, (params.req.method.toLowerCase() === "get" || params.req.method.toLowerCase() ==='delete')?params.req.query:params.req.body);

            return {
                status: 500,
                success: 0,
                message: "Internal Server Error!", 
            }; 
        }
    }else{
        /* Log Errors & Send FAILURE Response msg */
        return {
            status: 401,
            success: 0,
            message: "Unauthorized action!", 
        }; 
    }
}

exports.checkCredentials = checkCredentials;
exports.safelyProcessRequestMSG = safelyProcessRequestMSG;