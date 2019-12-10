'use strict';

let log             = require("./libs/logger")(`Pid: ${process.pid} Index:log`),
    error           = require("./libs/logger")(`Pid: ${process.pid} Index:error`),
    Http            = require("./libs/http-server");

process.on('uncaughtException', err => {
    error("+ERR - Caught exception: err: %j", err ? err.stack : err);
});

// Define the list of servers we are planning to start
let servers = [Http];

/**
 * Recursive function to start all servers one by one
 */
(function startServers(serv_idx) {
    let server = servers[serv_idx];

    if(!server) {
        return log("+OK - startServers. Servers are ready");
    }

    if(typeof server.initServer !== "function") {
        return error("+ERR - startServers. %s should implement initServer function", server.constructor.name);
    }

    log("+OK - startServers. iterate over: %s", server.constructor.name);

    server.initServer(err => {
        if(err) {
            error("+ERR - startServers. Can not start %s server", server.constructor.name);
            return process.exit();
        }
        log("+OK - startServers. %s has been started", server.constructor.name);

        startServers(++serv_idx);
    });
})(0);

/**
 * Recursive function to stop all servers one by one
 */
function stopServers(serv_idx) {
    let server = servers[serv_idx];

    if(!server) {
        log("+OK - stopServers. Servers are stopped");
        return process.exit();
    }

    if(typeof server.close !== "function") {
        return error("+ERR - stopServers. %s should implement initServer function", server.constructor.name);
    }

    log("+OK - stopServers. iterate over: %s", server.constructor.name);

    server.close(err => {
        if(err) {
            error("+ERR - stopServers. Can not stop %s server", server.constructor.name);
            // return process.exit();
        }
        log("+OK - stopServers. %s has been stopped", server.constructor.name);

        stopServers(++serv_idx);
    });
}

// Handler for SIGNHUP, SIGINT signals
process.on("SIGHUP", stopServers.bind(null, 0));
process.on("SIGINT", stopServers.bind(null, 0));