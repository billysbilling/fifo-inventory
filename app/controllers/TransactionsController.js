"use strict";

let log                 = require("debug")(`Pid: ${process.pid} ProductsService:log`),
    error               = require("debug")(`Pid: ${process.pid} ProductsService:error`),
    TransactionsModel   = require("../models/transactions");

/**
 * @fileOverview ProductsController. Handlers for all /products/* requests
 *
 * @author Anton Pavlov
 *
 * @module controllers/products
 *
 * @requires express
 * @requires ProductsModel
 */

/**
 * Get list of products
 *
 * @returns {Object}
 * <pre>
 *  [
 *      {
 *          "id": <Number>,
 *          "name": <String>,
 *          "quantity": <Number>
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
 * Get product by id
 * 
 * @param {Number} productid - Identifier of product
 *
 * @returns {Object}
 * <pre>
 *  {
 *      "id": <Number>,
 *      "name": <String>,
 *      "quantity": <Number>
 *  }
 * </pre>
 */
exports.productidGET = function(req, res, next) {

    let args = req.swagger.params;

    log("+OK - productidGET. args: %j", args);

    const get_product_by_id_fields = {
        id: args.productid.value
    };

    ProductsModel.getProductById(get_product_by_id_fields)
        .then(result => {
            if(!result) {
                throw new Error("E_NOT_FOUND");
            }
            res.json(result);
        })
        .catch(err => {
            error("+ERR - productidGET. err: %s stack: %s", err.toString(), err.stack);

            next(err);
        });
};

/**
 * Delete product by id
 * 
 * @param {Number} productid - Identifier of product
 *
 * @returns {String}
 */
exports.productidDELETE = function(req, res, next) {

    let args = req.swagger.params;

    log("+OK - productidDELETE. args: %j", args);

    const delete_product_by_id_fields = {
        id: args.productid.value
    };

    ProductsModel.deleteProductById(delete_product_by_id_fields)
        .then(result => {
            if(!result.affectedRows) {
                throw new Error("E_NOT_FOUND");
            }
            res.end();
        })
        .catch(err => {
            error("+ERR - productidDELETE. err: %s stack: %s", err.toString(), err.stack);

            next(err);
        });
};

/**
 * Update product by id
 * 
 * @param {Number} productid - Identifier of product
 * @param {String} name
 *
 * @returns {String}
 */
exports.productidPUT = function(req, res, next) {

    let args = req.swagger.params;

    log("+OK - productidPUT. args: %j", args);

    const update_product_by_id_fields = {
        id:     args.productid.value,
        name:   args.body.value.name
    };

    ProductsModel.updateProductById(update_product_by_id_fields)
        .then(result => {
            // if(!result.affectedRows) {
            //     throw new Error("E_NOT_FOUND");
            // }
            res.json(result);
        })
        .catch(err => {
            error("+ERR - productidPUT. err: %s stack: %s", err.toString(), err.stack);

            next(err);
        });
};

/**
 * Create product
 *
 * @param {String} name
 *
 * @returns {String}
 */
exports.productsPUT = function(req, res, next) {

    let args = req.swagger.params;

    log("+OK - productsPUT. args: %j", args);

    const create_product_fields = {
        name:   args.body.value.name,
        price:  args.body.value.price
    };

    ProductsModel.createProduct(create_product_fields)
        .then(data => {
            log("+OK - productsPUT. Product has been added successfully");

            res.end();
        })
        .catch(err => {
            error("+ERR - productsPUT. err: %s stack: %s", err.toString(), err.stack);

            next(err);
        });
};

/**
 * Buy products
 *
 * @param {Number} quantity
 *
 * @returns {String}
 */
exports.productidbuyPUT = function(req, res, next) {

    let args = req.swagger.params;

    log("+OK - productidbuyPUT. args: %j", args);

    const get_product_by_id_fields = {
        id: args.productid.value
    };

    const operation_id = "buy";

    let product;
    ProductsModel.getProductById(get_product_by_id_fields)
        .then(data => {
            log("+OK - productidbuyPUT. data: %j", data);

            if(!data) {
                throw new Error("E_NOT_FOUND");
            }

            // Save to local variable
            product = data;

            const update_product_by_id_fields = {
                id:         args.productid.value,
                quantity:   product.quantity + args.body.value.quantity
            };
        
            return ProductsModel.updateProductById(update_product_by_id_fields);
        })
        .then(data => {

            // {"prod_id":2,"total_cost":null,"type":"buy"}
            const add_transaction_fields = {
                prod_id:            args.productid.value,
                quantity:           args.body.value.quantity,
                price_per_item:     product.price,
                total_cost:         product.price * args.body.value.quantity,
                type:               operation_id
            };
        
            return TransactionsModel.addTransaction(add_transaction_fields);
        })
        .then(data => {
            log("+OK - productidbuyPUT.");
            res.end();
        })
        .catch(err => {
            error("+ERR - productidbuyPUT. err: %s stack: %s", err.toString(), err.stack);
            next(err);
        });
};

/**
 * Sell products
 *
 * @param {Number} quantity
 *
 * @returns {String}
 */
exports.productidsellPUT = function(req, res, next) {

    let args = req.swagger.params;

    log("+OK - productidbuyPUT. args: %j", args);

    const get_product_by_id_fields = {
        id: args.productid.value
    };

    const operation_id = "buy";

    let product;
    ProductsModel.getProductById(get_product_by_id_fields)
        .then(data => {
            log("+OK - productidbuyPUT. data: %j", data);

            if(!data) {
                throw new Error("E_NOT_FOUND");
            }

            // Save to local variable
            product = data;

            const update_product_by_id_fields = {
                id:         args.productid.value,
                quantity:   product.quantity - args.body.value.quantity
            };
        
            return ProductsModel.updateProductById(update_product_by_id_fields);
        })
        .then(data => {

            // {"prod_id":2,"total_cost":null,"type":"buy"}
            const add_transaction_fields = {
                prod_id:            args.productid.value,
                quantity:           args.body.value.quantity,
                price_per_item:     product.price,
                total_cost:         product.price * args.body.value.quantity,
                type:               operation_id
            };
        
            return TransactionsModel.addTransaction(add_transaction_fields);
        })
        .then(data => {
            log("+OK - productidbuyPUT.");
            res.end();
        })
        .catch(err => {
            error("+ERR - productidbuyPUT. err: %s stack: %s", err.toString(), err.stack);
            next(err);
        });
};