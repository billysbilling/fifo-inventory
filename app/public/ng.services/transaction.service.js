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
        getTransactions:  getTransactions,
        removeTransaction:   removeTransaction,
        updateTransaction:   updateTransaction,
        getTransactionById:  getTransactionById,
        createTransaction:   createTransaction
    };

    return service;

    /////////////////////
    // Implementations
    /////////////////////

    // Public functions
    function getTransactions() {
        return $http.get('/transactions').then( handleSuccess, handleError );
    }

    function getTransactionById(transaction_id) {
        return $http.get('/transactions/' + transaction_id).then( handleSuccess, handleError );
    }

    function removeTransaction(transaction_id) {
        return $http.delete('/transactions/' + transaction_id).then( handleSuccess, handleError );
    }

    function updateTransaction(data) {
        return $http.put('/transactions/' + data.id, data).then( handleSuccess, handleError );
    }

    function createTransaction(data) {
        return $http.put('/transactions', data).then( handleSuccess, handleError );
    }

    // Private functions
    function handleSuccess(response) {
        return( response.data );
    }

    function handleError(status, data) {
        logger.error("+ERR - TransactionService. status: ",status, "data: ",data);
        return {
            success:    false,
            error:      (status && status.statusText) || "Internal Server Error"
        };
    }
}