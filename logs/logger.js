var path = require('path');
var log4js = require('log4js');

log4js.configure({
    appenders: { 
        app: { type: "file", filename: path.join(__dirname, "log_files/app.log")  },
        errors: { type: "file", filename: path.join(__dirname, "log_files/errors.log") },
        activity: { type: "file", filename: path.join(__dirname, "log_files/activity.log") }
    },
    categories: { 
        default: { appenders: ["app"], level: "all" }, 
        errors: { appenders: ["errors"], level: "error" },
        activity: { appenders: ["activity"], level: "info" }
    }
});

module.exports.appLogger = log4js.getLogger("app");
module.exports.errorLogger = log4js.getLogger("errors");
module.exports.activityLogger = log4js.getLogger("activity");