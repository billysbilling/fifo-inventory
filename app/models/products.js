'use strict';

let log         = require("../libs/logger")(`Pid: ${process.pid} ProductsModel:log`),
    error       = require("../libs/logger")(`Pid: ${process.pid} ProductsModel:error`),
    Database    = require("../db-connectors/maria-db");

/**
 * @constructor
 * @augments Database
 *
 * @classdesc Products Model
 *
 * @author Anton Pavlov
 *
 * @requires Database
 */
class Products extends Database {

    constructor() {
        super();
        log("+OK - Products Model initialized");
    }

    /**
     * Function for creating product
     *
     * @param {Object}  params
     * @param {String}  params.name
     *
     * @return {Promise}
     */
    createProduct(params) {
        log("+OK - createProduct. params: %j", params);

        return this.insert("products", params);
    }

    /**
     * Function for getting all products
     *
     * @returns {Promise}
     */
    getProducts() {
        log("+OK - getProducts");

        return this.fetchAll('SELECT id, name, quantity, price FROM products');
    }

    /**
     * Function for getting specific product by id
     *
     * @param {Object}  params
     * @param {Number}  params.id - Identifier of product
     *
     * @returns {Promise}
     */
    getProductById(params) {
        log("+OK - getProductById");

        const query = 'SELECT id, name, quantity, price FROM products WHERE id = ?';
 
        return this.fetchOne(query, [params.id]);
    }
    
    /**
     * Function for deleting specific product by id
     *
     * @param {Object}  params
     * @param {Number}  params.id - Identifier of product
     *
     * @returns {Promise}
     */
    deleteProductById(params) {
        log("+OK - deleteProductById");

        return this.delete('products', params);
    }

    /**
     * Function for updating product by id
     *
     * @param {Object}  params
     * @param {String}  params.id
     * @param {String}  params.name
     *
     * @returns {Promise}
     */
    updateProductById(params) {
        log("+OK - updateProductById");

        return this.update("products", params, { id: params.id });
    }

    /**
     * Task 1
     *
     * @param {Object}  params
     * @param {Number}  params.date - Identifier of product
     *
     * @returns {Promise}
     */
    getTask1(params) {
        log("+OK - getTask1");
        const query = 'SELECT SUM(quantity) AS result FROM transactions WHERE date < DATE(?)';
        return this.fetchOne(query, [params.date]);
    }

    /**
     * Task 2
     *
     * @param {Object}  params
     * @param {Number}  params.date - Identifier of product
     *
     * @returns {Promise}
     */
    getTask2(params) {
        log("+OK - getProdgetTask2uctById");
        const query = 'SELECT SUM(total_cost) AS result FROM transactions WHERE date < DATE(?)';
        return this.fetchOne(query, [params.date]);
    }

    /**
     * Task 3
     *
     * @param {Object}  params
     * @param {Number}  params.date - Identifier of product
     *
     * @returns {Promise}
     */
    getTask3(params) {
        log("+OK - getProdgetTask2uctById");
        const query = 'SELECT ABS(SUM(total_cost)) AS result FROM transactions WHERE date < DATE(?) AND type = \'sell\'';
        return this.fetchOne(query, [params.date]);
    }
}

module.exports = new Products();