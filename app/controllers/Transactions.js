'use strict';

let TransactionsController = require('./TransactionsController');

module.exports.transactionsGET = function(req, res, next) {
    TransactionsController.transactionsGET(req, res, next);
};

module.exports.transactionidDELETE = function(req, res, next) {
    TransactionsController.transactionidDELETE(req, res, next);
};

module.exports.transactionidGET = function(req, res, next) {
    TransactionsController.transactionidGET(req, res, next);
};