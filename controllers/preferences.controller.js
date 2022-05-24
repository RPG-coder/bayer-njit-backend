/*********************************************************
 * Preferences Controller module
 * @module /controllers/preference.controller.js
 * @version 1.28.2022
 * 
 * @author Rahul Gautham Putcha <rp39@njit.edu>
 * @contributors Jianlen Ren, Rahul Gautham Putcha, Jiawei Wang, Sai Kiran Pocham
 * @description contains core function managing user preferences (FAR VISION: User Histories too)
 * 
 * Functions included:
 * 1. getPreferences() - safe
 * 2. createPreference() - unsafe
 * 3. deletePreference() - unsafe
 * 4. editPreferenece() - unsafe
 * 
 * safe - makes no changes in database, or atleast existing data.
 * unsafe - makes a change to the database
 * 
 * Note: Preference is Basic CRUD Application.
 * 
 * 
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
const { activityLogger, errorLogger } = require("../logs/logger");
const database = require("../models");
const User = database.User;
const Preferences = database.Preferences;
const FormSettings = database.FormSettings;
const { checkCredentials, safelyProcessRequestMSG } = require("./common.controller");
const { Op, QueryTypes } = database.Sequelize;

/**
 * Get a list of preferences, specific to a user with userid. jsonData contains the filter values stored at mySQL end. 
 * @param {JSON} req - request msg
 * @returns {SuccessMessage|FailureMessage} response msg
 **/
exports.getPreferences = async (req) => {
    
    return await safelyProcessRequestMSG({req}, async (params)=>{
        const user = await User.findOne({where: {userid: req.query.userid}});

        /* Finding all preferences belonging to a respective user with userid */
        const userPreferences = await database.sequelize.query(
            /* Working with the Composite Primary Key Fetching */
            `SELECT f.id, f.userid, f.jsonData, p.saveName, p.createdAt FROM FormSettings AS f JOIN Preferences AS p ON f.userid=p.userid WHERE p.id = f.id ` +
            `AND f.userid='${user.userid}'`, { type: QueryTypes.SELECT }
        );

        const response = {
            preferenceList: userPreferences
        }
        if (user.defaultPreferenceId) response['defaultPreferenceId'] = user.defaultPreferenceId;

        return response;
    });

}

/**
 * Create a new preference based on the user request.
 * @function createPreference()
 * @param {JSON} req - request msg
 * @returns {SuccessMessage|FailureMessage} response msg
 **/
exports.createPreference = async (req) => {
    
    return await safelyProcessRequestMSG({req}, async (params)=>{
        if (req.body.saveName && req.body.jsonData) {

            const formSettingMaxId = await FormSettings.findOne({
                attributes: [[database.sequelize.fn('max', database.sequelize.col('id')), 'maxId']],
                where: { userid: req.body.userid }
            });

            const setting = await FormSettings.create({ id: formSettingMaxId.dataValues.maxId + 1, userid: req.body.userid, jsonData: req.body.jsonData });
            const preference = await Preferences.create({ id: formSettingMaxId.dataValues.maxId + 1, userid: req.body.userid, saveName: req.body.saveName });

            if (req.body.makeDefault == true) {
                const user = await User.findOne({ where: { userid: req.body.userid } });
                user.defaultPreferenceId = preference.id;
                await user.save();
                await user.reload();
            }
            return {
                id: formSettingMaxId.dataValues.maxId + 1,
                userid: req.body.userid,
                saveName: preference.saveName,
                createdAt: preference.createdAt,
                jsonData: setting.jsonData
            }
        } else {
            throw Error("Bad Request")
        }
    });

}

/**
 * Delete an existing preference based on user request (containing a preferenceId)
 * @param {JSON} req - request msg
 * @returns {SuccessMessage|FailureMessage} response msg
 */
exports.deletePreference = async (req) => {

    const deletePref = async (req)=>{
        if (req.query.preferenceId) {
            const preference = await Preferences.findOne({where: {id: req.query.preferenceId,userid: req.query.userid}});
            await preference.destroy();

            const setting = await FormSettings.findOne({where: {id: req.query.preferenceId, userid: req.query.userid}});
            await setting.destroy();
            return { id: req.query.preferenceId };

        } else {
            throw Error("Preference not deleted!");
        }
    }

    return await safelyProcessRequestMSG({req}, async (params)=>{return await deletePref(params.req);});

}

/**
 * Get a list of preferences, specific to a user with userid. jsonData contains the filter values stored at mySQL end. 
 * @param {JSON} req - request msg
 * @returns {SuccessMessage|FailureMessage} response msg
 **/
exports.editPreference = async (req) => {
    
    return await safelyProcessRequestMSG({req}, async (params)=>{

        if (req.body.preferenceId && req.body.saveName && req.body.jsonData) {
            const success = await Preferences.update({
                saveName: req.body.saveName
            },{
                where: {id: req.body.preferenceId, userid: req.body.userid}
            });
            
            const preference = await Preferences.findOne({
                where: {id: req.body.preferenceId,userid: req.body.userid}
            });

            if(success[0]){
                if (req.body.makeDefault == true) {
                    const user = await User.findOne({ where: { userid: req.body.userid } });
                    user.defaultPreferenceId = preference.id;
                    await user.save();
                    await user.reload();
                }

                await FormSettings.update({jsonData:req.body.jsonData} ,{
                    where: {id: req.body.preferenceId,userid: req.body.userid}
                });

                const setting = await FormSettings.findOne({
                    where: {id: req.body.preferenceId,userid: req.body.userid}
                });

                return {
                    id: preference.id,
                    userid: preference.userid,
                    saveName: preference.saveName,
                    createdAt: preference.createdAt,
                    jsonData: setting.jsonData
                };
            }else {
                throw Error("Resource not found!")
            }

        } else {
            throw Error("Bad Request");
        }

    });

}