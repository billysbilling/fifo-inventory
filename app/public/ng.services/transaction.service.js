'use strict';

angular
    .module('codeChal.transactionService', [])
    .service('TransactionService', TransactionService);

TransactionService.$inject = ["$http", "$log"];

/**
 * TransactionService for communication with REST API
 *
 * @param $http
 * @param logger
 *
 * @returns {{getTransactions: getTransactions, removeTransaction: removeTransaction, updateTransaction: updateTransaction, getTransactionById: getTransactionById, createTransaction: createTransaction}}
 *
 * @constructor
 */
function TransactionService($http, logger) {

    logger.debug("+OK - TransactionService");

    var service = {
        getTransactions:    getTransactions,
        removeTransaction:  removeTransaction,
        createTransaction:  createTransaction
    };

    return service;

    /////////////////////
    // Implementations
    /////////////////////

    // Public functions
    function getTransactions() {
        return $http.get('/transactions').then( handleSuccess );
    }

    function removeTransaction(transaction_id) {
        return $http.delete('/transactions/' + transaction_id).then( handleSuccess );
    }

    function createTransaction(data) {
        return $http.put('/transactions', data).then( handleSuccess );
    }

    // Private functions
    function handleSuccess(response) {
        return( response.data );
    }
}