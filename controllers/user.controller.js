const database = require("../models");
const accessTable = database.accessTable;
const user = {};

/* -- 
  @function: createUser
  @details: Create a single user by storing it in the `user_admin_access` table -- */
exports.createUser = (req, res) => {
  console.log(req.body)
  if(req.body.register_email && req.body.register_userid && req.body.register_password){
    console.log(`[INFO]: Received ${JSON.stringify(req.body)}`);

    user.email = req.body.register_email; 
    user.username = req.body.register_userid; 
    user.password = req.body.register_password;

    /* -- Create User -- */
    accessTable.create(user)
      .then(data => {
        res.cookie("userData", user);
        res.status(200).send({success:1, message: "You are now officialy registered!", data: data});
      })
      .catch(err => {
        res.status(500).send({success:0, message: "UserID/Email is already added in to our database"});
      });
    }else{
        res.status(500).send({signup:0, message: "Email, username & password are not provided correctly"});
    }
};

/* Clear User Authentication token & Cookie/Sessions */
exports.logOut = (req,res) => {
  if(req.cookies.userData){
    console.log(`Received: ${JSON.stringify(req.cookies.userData)}`);
    console.log(`And Body is: ${req.body}`);
    res.clearCookie("userData");
    res.status(200).send({message: "User sucessfully logged out"});
  }else{
    res.status(401).send({
        message: "Unknown user cannot logout!"
    });
  }
}

/* For Login purpose */
exports.performAuthentication = (req, res) => {
  if(req.body.login_userid && req.body.login_password){
    
    /* Find record with user-id */
    accessTable.findByPk(req.body.login_userid)
    .then(data => {
      /* Perform password auth here ... */
      console.log([data.password === req.body.login_password])
      if(data.password === req.body.login_password){
        user.userid = req.body.login_userid;
        user.password = req.body.login_password;
        res.cookie("userData", user);
        res.status(200).send({success: 1, message: "Login: Sucessful!" });
      }else{
        res.status(401).send({success: 0, message: "Invalid UserID/Password!"});
      }
    })
    .catch(err => {
      res.status(400).send({
        success: 0, message: "Bad Request"
      });
    });
    
  }else{
    res.status(400).send({
        success: 0, message: "Bad Request: Credentials are not passed correctly!"
    });
  }
}
