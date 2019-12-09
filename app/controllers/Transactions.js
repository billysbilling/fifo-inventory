'use strict';

let TransactionsController = require('./TransactionsController');

module.exports.transactionsGET = function(req, res, next) {
    TransactionsController.transactionsGET(req, res, next);
};