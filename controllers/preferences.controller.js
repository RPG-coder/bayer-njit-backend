/* --- Import Files --- */
const database = require("../models");
const User = database.User;
const Preferences = database.Preferences;
const FormSettings = database.FormSettings;
const {checkCredentials} = require("./common.controller");
const {Op, QueryTypes} = database.Sequelize;

/*********************************************************
 * Controller for Bayer Patient Finder: User Preferences
 * for more information on the API documentation please visit: <Doc_Link_here>
 * 
 * @contain functions (interface functions)
 * 1. getPreferences() - safe
 * 2. createPreference() - unsafe
 * 3. deletePreference() - unsafe
 * 4. editPreferenece() - unsafe
 * 
 * safe - makes no changes in database, or atleast existing data.
 * unsafe - makes a change to the database
*********************************************************/

exports.getPreferences = async (req) => {
    /**
     * Get a list of preferences, specific to a user with userid. jsonData contains the filter values stored at mySQL end. 
     * @function getPreferences()
     * @param {JSON} req - request object with a body attribute, as specified in the Patient Finder API documentation
     * @returns {JSON} a response object, as specified in API documentation for Bayer's PF application
     **/
    console.log("Got message: preference",req.query);
    try{
        if(await checkCredentials(req)){
            const user = await User.findOne({ 
                where: {
                    userid: req.query.userid
                } 
            });

            /* Working with the Composite Primary Key Fetching */
            const userPreferences = await database.sequelize.query(
                `SELECT f.id, f.userid, f.jsonData, p.saveName FROM FormSettings AS f JOIN Preferences AS p ON f.userid=p.userid WHERE p.id = f.id `+
                `AND f.userid='${user.userid}'`, { type: QueryTypes.SELECT }
            );

            const response = {
                status: 200,
                success: 1,
                preferenceData: userPreferences
            }
            if(user.defaultPreferenceId){
                response['defaultPreferenceId'] = user.defaultPreferenceId;
            }
            return response; 

        }else{
            return {
                status: 401,
                success:0,
                message: "Unauthorized action!", 
            };
        }
    } catch(err){
        return {
            status: 500,
            success:0,
            message: "Internal Server Error!", 
        };
    }

}

exports.createPreference = async (req) => {
    /**
     * Create a new preference based on the user request.
     * @function createPreference()
     * @param {JSON} req - request object with a body attribute, as specified in the Patient Finder API documentation
     * @returns {JSON} a response object, as specified in API documentation for Bayer's PF application
     **/
    try{
        if(await checkCredentials(req)){
            if(req.body.saveName && req.body.jsonData){
            
                const formSettingMaxId = await FormSettings.findOne({
                    attributes: [[database.sequelize.fn('max', database.sequelize.col('id')), 'maxId']], 
                    where:{userid: req.body.userid}
                });

                const setting = await FormSettings.create({id: formSettingMaxId.dataValues.maxId+1, userid: req.body.userid, jsonData: req.body.jsonData});
                const preference = await Preferences.create({id: formSettingMaxId.dataValues.maxId+1, userid: req.body.userid, saveName: req.body.saveName});

            

                console.log(setting, 'settings');
                if(req.body.makeDefault==true){
                    console.log('Default preference set');
                    const user = await User.findOne({where:{userid: req.body.userid}});
                    user.defaultPreferenceId = preference.id;
                    await user.save();
                    await user.reload();
                }
                return {
                    status: 200,
                    success:1,
                    message: "Preference added sucessfully",
                    data: {
                        id: formSettingMaxId.dataValues.maxId+1,
                        userid: req.body.userid,
                        saveName: preference.saveName,
                        jsonData: setting.jsonData
                    }
                }
            } else{
                return {
                    status: 400,
                    success:0,
                    message: "Bad Request!", 
                };
            }
        }else{
            return {
                status: 401,
                success:0,
                message: "Unauthorized action!", 
            };
        }
    }catch(err){
        return {
            status: 500,
            success:0,
            message: "Internal Server Error!", 
        };
    }
      
}

exports.deletePreference = async (req) => {
    /**
     * Delete an existing preference based on user request (containing a preferenceId)
     * @function deletePreference()
     * @param {JSON} req - request object with a body attribute, as specified in the Patient Finder API documentation
     * @returns {JSON} a response object, as specified in API documentation for Bayer's PF application
     */
    try{
        if(await checkCredentials({body:{userid: req.query.userid, authToken: req.query.authToken}})){
            console.log(req.query.preferenceId, 'preferenceId')
            if(req.query.preferenceId){
                const preference = await Preferences.findOne({
                    where : {
                        id: req.query.preferenceId,
                        userid: req.query.userid
                    }
                });
                await preference.destroy();

                const setting = await FormSettings.findOne({
                    where : {
                        id: req.query.preferenceId,
                        userid: req.query.userid
                    }
                });
                await setting.destroy();
                return {
                    status: 200,
                    success:1,
                    message: "Preference deleted sucessfully!",
                    preferenceId: req.body.preferenceId
                }
                    
            } else{
                return {
                    status: 400,
                    success:0,
                    message: "Bad Request!", 
                };
            }
        }else{
            return {
                status: 401,
                success:0,
                message: "Unauthorized action!", 
            };
        }
    }catch(err){
        return {
            status: 500,
            success:0,
            message: "Internal Server Error!", 
        };
    }
}

exports.editPreference = async (req) => {
    /**
     * Get a list of preferences, specific to a user with userid. jsonData contains the filter values stored at mySQL end. 
     * @function editPreference()
     * @param {JSON} req - request object with a body attribute, as specified in the Patient Finder API documentation
     * @returns {JSON} a response object, as specified in API documentation for Bayer's PF application
     **/
    try{
        if(await checkCredentials(req)){
            if(req.body.preferenceId && req.body.saveName && req.body.jsonData){
                const preference = await Preferences.findOne({
                    where : {
                        id: req.body.preferenceId,
                        userid: req.body.userid
                    }
                });
                preference.saveName = req.body.saveName;
                await preference.save();
                await preference.reload();

                const setting = await FormSettings.findOne({
                    where : {
                        id: req.body.preferenceId,
                        userid: req.body.userid
                    }
                });
                setting.jsonData = req.body.jsonData;
                await setting.save();
                await setting.reload();

                return {
                    status: 200,
                    success:1,
                    message: "Preference updated sucessfully!",
                    data: {
                        id: preference.id,
                        userid: preference.userid,
                        saveName: preference.saveName,
                        jsonData: setting.jsonData
                    }   
                }
            } else{
                return {
                    status: 400,
                    success:0,
                    message: "Bad Request!", 
                };
            }
        }else{
            return {
                status: 401,
                success:0,
                message: "Unauthorized action!", 
            };
        }
    }catch(err){
        return {
            status: 500,
            success:0,
            message: "Internal Server Error!", 
        };
    }    
}
