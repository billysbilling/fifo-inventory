'use strict';

let { createLogger, format, transports }    = require('winston'),
    { combine, timestamp, label, printf }   = format,
    path                                    = require('path'),
    config                                  = require('../config/config');

function Logger(module_name) {

    let level = "debug",
        label_str = "DefaultModule",
        delim_index = module_name.lastIndexOf(":"),
        logger = createLogger({});

    // We expect module_name as for example Pid: 57729 HttpRequest
    // If : is in the center of string
    if(delim_index > 0 && delim_index < module_name.length) {

        label_str = module_name.substring(0, delim_index);
        let temp_level = module_name.substring(delim_index+1);

        // replace log to debug
        // And check that winston supports such level
        if((temp_level !== "log") && (typeof logger[temp_level] === "function")) {
            level = temp_level;
        }
    }

    const myFormat = printf(info => {
        return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
    });

    // Define options for console logger
    const console_options = {
        level: process.env.NODE_ENV === 'production' ? "error" : "debug",
        format: combine(
            format.splat(),
            format.colorize(),
            label({ label: label_str }),
            timestamp(),
            myFormat
        )
    };

    // Define options for file logger
    const file_options = {
        datePattern:    config.logging.datePattern,
        filename:       "log-" + config.logging.filename,
        dirname:        path.resolve(__dirname, "../"+config.logging.path),
        maxSize:        config.logging.maxSize,
        maxFiles:       config.logging.maxFiles,
        level:          process.env.NODE_ENV === 'production' ? "error" : "debug",
        format: format.combine(
            format.splat(),
            label({ label: label_str }),
            timestamp(),
            myFormat
        )
    };

    logger.configure({
        transports: [
            new transports.Console(console_options),
            new (require('winston-daily-rotate-file'))(file_options)
        ]
    });

    return logger[level];
}

module.exports = Logger;