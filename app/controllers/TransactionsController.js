"use strict";

let log                 = require("../libs/logger")(`Pid: ${process.pid} TransactionsController:log`),
    error               = require("../libs/logger")(`Pid: ${process.pid} TransactionsController:error`),
    TransactionsModel   = require("../models/transactions");

/**
 * @fileOverview TransactionsController. Handlers for all /transactions/* requests
 *
 * @author Anton Pavlov
 *
 * @module controllers/transactions
 *
 * @requires express
 * @requires TransactionsModel
 */

/**
 * Get list of transactions
 *
 * @returns {Object}
 * <pre>
 *  [
 *      {
 *          "id": <Number>,
 *          "prod_id": <String>,
 *          "quantity": <Number>
 *          "total_cost": <Number>
 *          "price_per_item": <Number>
 *          "type": <String>
 *          "date": <String>
 *      },
 *      ...
 *  ]
 * </pre>
 */
exports.transactionsGET = function(req, res, next) {

    let args = req.swagger.params;

    log("+OK - transactionsGET. args: %j", args);

    TransactionsModel.getTransactions()
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            error("+ERR - transactionsGET. err: %s stack: %s", err.toString(), err.stack);
            next(err);
        });
};

/**
 * Delete transaction by id
 * 
 * @param {Number} transactionid - Identifier of transaction
 *
 * @returns {String}
 */
exports.transactionidDELETE = function(req, res, next) {

    let args = req.swagger.params;

    log("+OK - transactionidDELETE. args: %j", args);

    const delete_transaction_by_id_fields = {
        id: args.transactionid.value
    };

    TransactionsModel.deleteTransactionById(delete_transaction_by_id_fields)
        .then(result => {
            if(!result.affectedRows) {
                throw new Error("E_NOT_FOUND");
            }
            res.end();
        })
        .catch(err => {
            error("+ERR - transactionidDELETE. err: %s stack: %s", err.toString(), err.stack);
            next(err);
        });
};

/**
 * Get transaction by id
 * 
 * @param {Number} transactionid - Identifier of transaction
 *
 * @returns {Object}
 * <pre>
 *  {
 *      "id": <Number>,
 *      "prod_id": <String>,
 *      "quantity": <Number>
 *      "total_cost": <Number>
 *      "price_per_item": <Number>
 *      "type": <String>
 *      "date": <String>
 *  }
 * </pre>
 */
exports.transactionidGET = function(req, res, next) {

    let args = req.swagger.params;

    log("+OK - transactionidGET. args: %j", args);

    const get_transaction_by_id_fields = {
        id: args.transactionid.value
    };

    TransactionsModel.getTransactionById(get_transaction_by_id_fields)
        .then(result => {
            if(!result) {
                throw new Error("E_NOT_FOUND");
            }
            res.json(result);
        })
        .catch(err => {
            error("+ERR - transactionidGET. err: %s stack: %s", err.toString(), err.stack);

            next(err);
        });
};