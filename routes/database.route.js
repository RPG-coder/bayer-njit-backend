/*  @name: database.route.js
    @type: Route file
    @details:
    This route.js file contains the API (interface) route that connects to the database.
    
 */
module.exports = (app, jsonParser ,urlParser) => {
    const database = require("../controllers/database.controller");

    /* -- Route settings -- */
    //app.post("/distinct-fields", jsonParser, database.fetchDistinctValues);
    //app.post("/fields", jsonParser, database.fetchValues);
    app.post("/view-treatment", jsonParser, database.fetchViewTreatment);
    app.post("/view-medical", jsonParser, database.fetchViewMedical);
};