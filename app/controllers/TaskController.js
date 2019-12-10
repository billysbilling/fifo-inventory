"use strict";

let log             = require("../libs/logger")(`Pid: ${process.pid} TaskController:log`),
    error           = require("../libs/logger")(`Pid: ${process.pid} TaskController:error`),
    ProductsModel   = require("../models/products");

/**
 * @fileOverview TaskController. Handlers for all /task/* requests
 *
 * @author Anton Pavlov
 *
 * @module controllers/task
 *
 * @requires express
 * @requires ProductsModel
 */

/**
 * Perform task
 *  
 * @param {String} date
 * @param {Number} task_id
 * 
 * @returns {Object} result
 */
exports.performtaskidPUT = function(req, res, next) {

    let args = req.swagger.params;

    log("+OK - performtaskidPUT. args: %j", args);

    let promise;
    
    switch(args.body.value.task_id) {
        case 1: {
            promise = ProductsModel.getTask1({date: args.body.value.date});
        } break;

        case 2: {
            promise = ProductsModel.getTask2({date: args.body.value.date});
        } break;

        case 3: {
            promise = ProductsModel.getTask3({date: args.body.value.date});
        } break;
    }

    if(!promise) {
        return next(new Error("E_NOT_FOUND"));
    }

    promise
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            error("+ERR - performtaskidPUT. err: %s stack: %s", err.toString(), err.stack);
            next(err);
        });
};
