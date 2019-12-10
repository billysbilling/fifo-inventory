'use strict';

let log         = require("../libs/logger")(`Pid: ${process.pid} TransactionsModel:log`),
    error       = require("../libs/logger")(`Pid: ${process.pid} TransactionsModel:error`),
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

    /**
     * Function for deleting specific transaction by id
     *
     * @param {Object}  params
     * @param {Number}  params.id - Identifier of transaction
     *
     * @returns {Promise}
     */
    deleteTransactionById(params) {
        log("+OK - deleteTransactionById");

        return this.delete('transactions', params);
    }

    /**
     * Function for getting specific product by id
     *
     * @param {Object}  params
     * @param {Number}  params.id - Identifier of product
     *
     * @returns {Promise}
     */
    getTransactionById(params) {
        log("+OK - getTransactionById");
        const query = 'SELECT id, prod_id, quantity, price_per_item, total_cost, date, type FROM transactions WHERE id = ?'; 
        return this.fetchOne(query, [params.id]);
    }
}

module.exports = new Transactions();