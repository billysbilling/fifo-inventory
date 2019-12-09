'use strict';

let log         = require("debug")(`Pid: ${process.pid} TransactionsModel:log`),
    error       = require("debug")(`Pid: ${process.pid} TransactionsModel:error`),
    Database    = require("../db-connectors/maria-db");

/**
 * @constructor
 * @augments Database
 *
 * @classdesc Transactions Model
 *
 * @author Anton Pavlov
 *
 * @requires Database
 */
class Transactions extends Database {

    constructor() {
        super();
        log("+OK - Transactions Model initialized");
    }

    /**
     * Function for creating transaction
     *
     * @param {Object}  params
     * @param {String}  params.name
     *
     * @return {Promise}
     */
    addTransaction(params) {
        log("+OK - createTransaction. params: %j", params);

        return this.insert("transactions", params);
    }

    /**
     * Function for getting all transactions
     *
     * @returns {Promise}
     */
    getTransactions() {
        log("+OK - getTransactions");

        return this.fetchAll('SELECT id, prod_id, quantity, price_per_item, total_cost, date, type FROM transactions');
    }
}

module.exports = new Transactions();