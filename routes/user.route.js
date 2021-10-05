module.exports = (app, jsonParser ,urlParser) => {
    const userControl = require("../controllers/user.controller");

    /* -- Route settings -- */
    app.post("/createusers", jsonParser, userControl.createUser);
    app.post("/authenticate", jsonParser, userControl.performAuthentication);
    app.post("/logout", jsonParser, userControl.logOut);
};