module.exports = (app, jsonParser ,urlParser) => {
    const userControl = require("../controllers/user.controller");

    /* -- Route settings -- */
    app.post("/register", jsonParser, userControl.createUser);
    app.post("/login", jsonParser, userControl.performAuthentication);
    app.post("/logout", jsonParser, userControl.logOut);
};