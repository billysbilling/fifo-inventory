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
        getProducts:    getProducts,
        removeProduct:  removeProduct,
        updateProduct:  updateProduct,
        getProductById: getProductById,
        createProduct:  createProduct,
        buyProduct:     buyProduct,
        sellProduct:    sellProduct,
    };

    return service;

    /////////////////////
    // Implementations
    /////////////////////

    // Public functions
    function getProducts() {
        return $http.get('/products').then( handleSuccess );
    }

    function getProductById(product_id) {
        return $http.get('/products/' + product_id).then( handleSuccess );
    }

    function removeProduct(product_id) {
        return $http.delete('/products/' + product_id).then( handleSuccess );
    }

    function updateProduct(data) {
        return $http.put('/products/' + data.id, data).then( handleSuccess );
    }

    function createProduct(data) {
        return $http.put('/products', data).then( handleSuccess );
    }

    function buyProduct(prod_id, data) {
        return $http.put('/products/'+prod_id+'/buy', data).then( handleSuccess );
    }

    function sellProduct(prod_id, data) {
        return $http.put('/products/'+prod_id+'/sell', data).then( handleSuccess );
    }

    // Private functions
    function handleSuccess(response) {
        return( response.data );
    }
}