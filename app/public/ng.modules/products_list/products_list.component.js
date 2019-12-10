'use strict';

angular
    .module('codeChal.products_list', [
        'codeChal.productService',
    ])
    .component('productsList', {
        templateUrl: 'ng.modules/products_list/products_list.view.html',
        controller: ProductsListController
    });

ProductsListController.$inject = ['$state', 'ProductService', 'Flash', '$log'];

/**
 * ProductsListController
 *
 * @param $state
 * @param ProductService
 * @param Flash
 * @param logger
 * @constructor
 */
function ProductsListController($state, ProductService, Flash, logger) {
    logger.debug("+OK - ProductsListController");

    var vm = this;

    vm.is_page_loaded       = false;

    vm.all_items            = [];
    vm.filtered_items       = [];
    vm.items_per_page       = [];

    vm.current_page         = 1;
    vm.page_size            = 10;

    vm.getPage          = getPage;
    vm.showProduct         = showProduct;
    vm.removeProduct       = removeProduct;

    init();

    /////////////////////
    // Implementations
    /////////////////////

    function getPage() {

        logger.debug("+OK - ProductsListController. getPage");

        var begin = ((vm.current_page - 1) * vm.page_size);
        var end = begin + vm.page_size;

        vm.filtered_items = vm.all_items;
        vm.items_per_page = vm.filtered_items.slice(begin, end);

        logger.debug("vm.filtered_items: ", vm.items_per_page, " begin: ",begin, " end: ", end);
    }

    function showProduct(id) {
        logger.debug("+OK - ProductsListController.showProduct id: ", id);

        $state.go("products_item", { product_id: id });
    }

    function removeProduct(id, $event) {
        logger.debug("+OK - ProductsListController.removeProduct id: ", id);

        $event.stopPropagation();

        ProductService.removeProduct(id)
            .then(function(result) {
                logger.debug("+OK - ProductsListController.removeProduct Product has been removed result: ",result);

                var product_idx = _.findIndex(vm.all_items, { 'id': id });
                vm.all_items.splice(product_idx, 1);

                getPage();

                Flash.create("success", "Product has been deleted successfully");
            })
            .catch(err => {
                logger.debug("+ERR - ProductsItemController.removeProduct. error: ", err);
                Flash.create("danger", err.data.message);
            });;
    }

    function init() {
        logger.debug("Init");

        ProductService.getProducts()
            .then(function(result) {
                logger.debug("+OK -  ProductsListController. result: ",result);

                vm.is_page_loaded = true;

                vm.all_items = result;
                vm.getPage();
            })
            .catch(err => {
                logger.debug("+ERR - ProductsListController. error: ", err);
                Flash.create("danger", "Can't request data");
            });
    }
}