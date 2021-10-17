/* --- Import Files --- */
const database = require("../models");
const Users = database.Preference;

/*********************************************************
 * Controller for Bayer Patient Finder: User Preferences
 * for more information on the API documentation please visit: <Doc_Link_here>
 * 
 * @contain functions
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
    
}