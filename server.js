/* -- Import Files -- */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser');

/* -- App configuration -- */
const app = express();

/* -- Parsers -- */
const jsonParser = bodyParser.json();
const urlEncoder = bodyParser.urlencoded({extended:true});
app.use(jsonParser);
app.use(urlEncoder);
app.use(cookieParser());
app.use(cors());

/* Create User API */
require("./routes/user.route")(app, jsonParser, urlEncoder);
require("./routes/database.route")(app, jsonParser, urlEncoder);

/* -- Setting up a MySQL connector -- */
const database = require("./models");
database.mysql.sync();


/* -- Server -- */
const PORT = process.env.PORT || 5000;
app.listen(PORT,
    console.log(`Server is running on port: ${PORT}`)
);

