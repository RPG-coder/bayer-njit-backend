const database = require("../models");

/**
 * Contains common code required by all other controllers.
 * @contains 
 * 1. checkCredentials
 */

/* --- Controller: Methods for accessing Patient Finder Data --- */
const checkCredentials = async (req)=>{
    try{
        const user = await database['User'].findOne({where:{userid: req.body.userid}});
        return user.authToken===req.body.authToken;
    }catch(err){
        console.log(err)
        return false;
    }
}

exports.checkCredentials = checkCredentials;