/* --- Import Files --- */
const database = require("../models");
const {v4} = require('uuid');
const Users = database.User;

/*********************************************************
 * Controller for Bayer Patient Finder: User
 * for more information on the API documentation please visit: <Doc_Link_here>
 * 
 * @contain functions
 * 1. register() - unsafe
 * 2. login() - unsafe
 * 3. logOut() - unsafe
 * 
 * safe - makes no changes in database, or atleast existing data.
 * unsafe - makes a change to the database
*********************************************************/

exports.register = async (req) => {
  /**
   * Create a new user to the patient finder application and provides a way for a user to gain access to the patient finder database. 
   * Start logging user’s accesses for the database by the using of an unique authToken. (Security feature)
   * @function register()
   * @param {JSON} req - request object with a body attribute, as specified in the Patient Finder API documentation
   * @returns {JSON} a response object
  **/
    if(req.body.email && req.body.userid && req.body.password && req.body.fullName){
        console.log(`[INFO]: Received request message ${JSON.stringify(req.body)} for an User Register\n`);
        
        const registerDetails={
            fullName: req.body.fullName,
            userid: req.body.userid,
            password: req.body.password,
            email: req.body.email,
            isLogged: true,
            authToken: v4()
        };
        
        try{
            /* -- Create a new User -- */
            const data = await Users.create(registerDetails);
            console.log(`[INFO]: Data received upon registering user ${registerDetails.userid} - \n ${JSON.stringify(data)}\n\n`);

            /* -- Logging user into Patient Finder application -- */
            const user = await Users.findByPk(registerDetails.userid);
            user.isLogged = true;
            await user.save(); await user.reload();

            /* Response Object on success */
            return {
                status: 200,
                success: user.isLogged | 0,
                userData: {
                    userid: user.userid,
                    fullName: user.fullName, 
                    email: user.email, 
                    authToken: user.authToken
                },
                message: "You are now officialy registered!"
            };
            
        }catch(err){
            /* Response Object on error from database */
            console.log(err.message);
            return {
                status: 401,
                success: 0,
                message: "UserID/Email is already taken.",
                error: err
            };
        };
    }else{
        /* Response Object on request format error */
        return {
            status: 400,
            signup: 0,
            message: "Bad Request",
            error: "Request message format unsupported"
        };
    }
};


exports.login = async (req) => {
    /**
     * Provides a way for a user to gain access to the patient finder database. 
     * Start logging user’s accesses for the database by the using of an unique authToken. 
     * (Security feature) authToken expires after 1 day.
     * @function register()
     * @param {JSON} req - request object with a body attribute, as specified in the Patient Finder API documentation
     * @returns {JSON} a response object
    **/
     console.log(`[INFO]: Received request message ${JSON.stringify(req.body)} for an User Login\n`);
    if(req.body.userid && req.body.password){
        console.log(`[INFO]: Received request message ${JSON.stringify(req.body)} for an User Login\n`);
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
                error: err
            };
            if(err){
                response.status = 401,
                response.message = "Invalid UserID/Password!";
            }
            return response;
        };
        
    }else{
        return {
            status: 400,
            success: 0, 
            message: "Bad Request",
            error: "Request message format unsupported"
        };
    }
}



exports.logOut = async (req) => {
    /**
     * Users will be logged out and the session will be ended. The user, upon logout, will no longer have their 
     * access until a new accessToken is generated by logging in.
     * @function logOut()
     * @param {JSON} req - request object with a body attribute, as specified in the Patient Finder API documentation
     * @returns {JSON} a response object
     **/
    if(req.body.userid && req.body.authToken){
        console.log(`[INFO]: Received request message ${JSON.stringify(req.body)} for an User Logout\n`);

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
                return {
                    status: 401,
                    success: 0,
                    message: "Unauthorized command!"
                };
            }

            
        }catch(err){
            return {
                status: 400,
                success: 0,
                message: "Bad Request",
                error: err
            };
        }

    }else{
        return {
            status: 400,
            success: 0,
            message: "Bad Request",
            error: "Request message format unsupported"
        };
    }
}