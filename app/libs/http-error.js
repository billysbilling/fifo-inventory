"use strict";

let error   = require("debug")(`Pid: ${process.pid} Error:error`),
    url     = require("url");

// Define list of possible errors
let err_codes = {
    "E_NOT_FOUND": {
        "message":      "Not found",
        "http_code":    404
    },
    "E_INT_SERVER": {
        "message":      "Internal server error",
        "http_code":    500
    }
};

// Define error by default
const DEFAULT_ERROR_CODE = "E_INT_SERVER";

const getFullUrl = req => {
    return url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    });
};

//Return net info like IP, User-Agent, referer
function errorHandler(err, req, res, next) {
    error("+ERR - errorHandler. url: %s err.message: %s err.stack: %s err: %j", getFullUrl(req), err.message, err.stack, err);

    if(!err) return next();
    if(res.headersSent) return next(err);

    // try to get code from original message
    let code = err.message;

    // Of code is not defined, use default code
    if(!err_codes[code]) {
        code = DEFAULT_ERROR_CODE;
    }

    // Get error info from errors list
    let error_obj = err_codes[code];

    res.status(error_obj.http_code).json({
        code,
        message: error_obj.message
    });
}

module.exports = errorHandler;