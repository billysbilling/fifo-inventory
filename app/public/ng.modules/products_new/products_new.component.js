'use strict';

angular
    .module('codeChal.products_new', [])
    .component('productsNew', {
        templateUrl: 'ng.modules/products_new/products_new.view.html',
        controller: ProductsNewController
    });

ProductsNewController.$inject = ['$state', 'ProductService', 'Flash', '$log'];

/**
 * Products New Controller
 * @param $state
 * @param $stateParams
 * @param ProductService
 * @param Flash
 * @param logger
 * @param $q
 * @constructor
 */
function ProductsNewController($state, ProductService, Flash, logger) {
    logger.debug("+OK - ProductsNewController.");

    var vm = this;

    vm.is_data_loading = false;

    vm.is_page_loaded = true;

    vm.product = null;

    vm.create = create;

    /////////////////////
    // Implementations
    /////////////////////

    function create() {
        logger.debug("+OK - ProductsNewController.create. vm.product: ", vm.product);

        ProductService.createProduct(vm.product)
            .then(function(result) {
                logger.debug("+OK - ProductsNewController.create. Product has been removed result: ", result);

                vm.is_data_loading = false;

                $state.go("products_list");
            })
            .catch(err => {
                logger.debug("+ERR - ProductsNewController.create. Can not create product: ",err);
                Flash.create("danger", err.data.message);
            });
    }
}