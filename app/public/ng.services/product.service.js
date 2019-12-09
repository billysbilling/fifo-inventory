'use strict';

angular
    .module('codeChal.productService', [])
    .service('ProductService', ProductService);

ProductService.$inject = ["$http", "$log"];

/**
 * ProductService for communication with REST API
 *
 * @param $http
 * @param logger
 *
 * @returns {{getProducts: getProducts, removeProduct: removeProduct, updateProduct: updateProduct, getProductById: getProductById, createProduct: createProduct}}
 *
 * @constructor
 */
function ProductService($http, logger) {

    logger.debug("+OK - ProductService");

    var service = {
        getProducts:  getProducts,
        removeProduct:   removeProduct,
        updateProduct:   updateProduct,
        getProductById:  getProductById,
        createProduct:   createProduct
    };

    return service;

    /////////////////////
    // Implementations
    /////////////////////

    // Public functions
    function getProducts() {
        return $http.get('/products').then( handleSuccess, handleError );
    }

    function getProductById(product_id) {
        return $http.get('/products/' + product_id).then( handleSuccess, handleError );
    }

    function removeProduct(product_id) {
        return $http.delete('/products/' + product_id).then( handleSuccess, handleError );
    }

    function updateProduct(data) {
        return $http.put('/products/' + data.id, data).then( handleSuccess, handleError );
    }

    function createProduct(data) {
        return $http.put('/products', data).then( handleSuccess, handleError );
    }

    // Private functions
    function handleSuccess(response) {
        return( response.data );
    }

    function handleError(status, data) {
        logger.error("+ERR - ProductService. status: ",status, "data: ",data);
        return {
            success:    false,
            error:      (status && status.statusText) || "Internal Server Error"
        };
    }
}