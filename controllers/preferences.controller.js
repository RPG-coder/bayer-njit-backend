/* --- Import Files --- */
const database = require("../models");
const Users = database.Preference;

/*********************************************************
 * Controller for Bayer Patient Finder: User Preferences
 * for more information on the API documentation please visit: <Doc_Link_here>
 * 
 * @contain functions
 * 1. register()
 * 2. login()
 * 3. logOut()
*********************************************************/

exports.getPreferences = async (req) => {
    /**
     * Get a list of preferences, specific to a user with userid. jsonData contains the filter values stored at mySQL end. 
     * @function getPreferences()
     * @param {JSON} req - request object with a body attribute, as specified in the Patient Finder API documentation
     * @returns {JSON} a response object
     **/
    
}