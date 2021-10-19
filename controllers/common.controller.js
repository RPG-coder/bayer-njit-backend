const database = require("../models");

/**
 * Contains common code required by all other controllers.
 * @contains 
 * 1. checkCredentials
 */

/* --- Controller: Methods for accessing Patient Finder Data --- */
const checkCredentials = async (req)=>{

    /* Decision on whether GET & POST */
    let request;
    if(req.method.toLowerCase() == "post"){
        request = req.body
    }else{
        request = req.query
    }

    try{
        const user = await database['User'].findOne({where:{userid: request.userid}});
        console.log(`User ${user.userid} authorization success: ${user.authToken===request.authToken}`);

        return user.authToken===request.authToken;
    }catch(err){
        console.log(err)
        return false;
    }
}

exports.checkCredentials = checkCredentials;