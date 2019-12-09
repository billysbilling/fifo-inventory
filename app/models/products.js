'use strict';

let log         = require("debug")(`Pid: ${process.pid} ProductsModel:log`),
    error       = require("debug")(`Pid: ${process.pid} ProductsModel:error`),
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
}

module.exports = new Products();