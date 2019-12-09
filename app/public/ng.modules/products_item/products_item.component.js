'use strict';

angular
    .module('codeChal.products_item', [
        'codeChal.productService',
        'codeChal.transactionService',
    ])
    .component('productsItem', {
        templateUrl: 'ng.modules/products_item/products_item.view.html',
        controller: ProductsItemController
    });

ProductsItemController.$inject = ['$state', '$stateParams', 'ProductService', 'TransactionService', 'Flash', '$log', '$q'];

/**
 * ProductsItemController
 *
 * @param $state
 * @param $stateParams
 * @param ProductService
 * @param Flash
 * @param logger
 * @param $q
 * @constructor
 */
function ProductsItemController($state, $stateParams, ProductService, TransactionService, Flash, logger, $q) {
    logger.debug("+OK - ProductsItemController. "+$stateParams.product_id);

    var vm = this;

    if(!$stateParams.product_id) {
        $state.go("products_list");
        return;
    }

    vm.is_data_loading = false;
    vm.is_page_loaded = false;

    // vm.all_items            = [];
    // vm.filtered_items       = [];
    // vm.items_per_page       = [];

    // vm.current_page         = 1;
    // vm.page_size            = 10;

    vm.product = null;
    vm.transactions = [];
    // vm.mappings_products = [];

    // vm.getPage          = getPage;
    vm.update           = update;
    vm.remove           = remove;
    vm.removeMapping    = removeMapping;
    vm.addMapping       = addMapping;

    init();

    /////////////////////
    // Implementations
    /////////////////////

    // function getPage() {

    //     logger.debug("+OK - ProductsItemController. getPage");

    //     var begin = ((vm.current_page - 1) * vm.page_size);
    //     var end = begin + vm.page_size;

    //     vm.filtered_items = vm.all_items;
    //     vm.items_per_page = vm.filtered_items.slice(begin, end);

    //     logger.debug("vm.filtered_items: ", vm.items_per_page, " begin: ",begin, " end: ", end);
    // }

    function removeMapping(mapping_id, product_id, event) {
        logger.debug("+OK - ProductsItemController.removeMapping. mapping_id: ", mapping_id, event);

        MappingService.removeMapping(mapping_id)
            .then(function(result) {
                vm.is_data_loading = false;

                var product = _.find(vm.products, { 'id': product_id });

                logger.debug("+OK - ProductsItemController.removeMapping. product: ", product);

                if(!product) {
                    logger.debug("+ERR - ProductsItemController.removeMapping. can not remove mapping");
                    return;
                }

                product.compatible = false;
            })
            .catch(err => {
                logger.debug("+ERR - ProductsItemController.removeMapping error: ", err);
                Flash.create("danger",err);
            });
    }

    function addMapping(product_id) {
        logger.debug("+OK - ProductsItemController.addMapping. product_id: ", product_id);

        if(product_id == $stateParams.product_id) {
            logger.debug("+ERR - ProductsItemController.addMapping. product1 is equal to product2");
            return;
        }

        var create_mapping_fields = {
            id_product1: product_id > $stateParams.product_id ? parseInt($stateParams.product_id) : parseInt(product_id),
            id_product2: product_id < $stateParams.product_id ? parseInt($stateParams.product_id) : parseInt(product_id)
        };

        MappingService.createMapping(create_mapping_fields)
            .then(function(result) {
                vm.is_data_loading = false;

                var product = _.find(vm.products, { 'id': product_id });

                logger.debug("+OK - ProductsItemController.addMapping. product: ", product);

                if(!product) {
                    logger.debug("+ERR - ProductsItemController.addMapping. Can not create mapping");
                    return;
                }

                product.compatible = true;
            })
            .catch(err => {
                logger.debug("+ERR - ProductsItemController.addMapping. error: ", err);
                Flash.create("danger",err);
            });
    }

    function remove() {
        logger.debug("+OK - ProductsItemController.remove", vm.product);

        ProductService.removeProduct(vm.product.id)
            .then(function(result) {

                vm.is_data_loading = false;

                $state.go("products_list");
            })
            .catch(err => {
                logger.debug("+ERR - ProductsItemController.remove. error: ", err);
                Flash.create("danger",err);
            });
    }

    function update() {
        logger.debug("+OK - ProductsItemController.update. vm.product: ", vm.product);

        ProductService.updateProduct(vm.product)
            .then(function(result) {
                vm.is_data_loading = false;

                Flash.create("success", "Product has been edited successfully");
            })
            .catch(err => {
                logger.debug("+ERR - ProductsItemController.update. error: ", err);
                Flash.create("danger",err);
            });
    }

    function init() {
        logger.debug("Init");

        $q.all({
            "product":      ProductService.getProductById($stateParams.product_id),
            "transactions": TransactionService.getTransactions(),
            // "mappings_products":   MappingService.getMappingsByProductId($stateParams.product_id)
        })
            .then(function(results) {
                logger.debug("+OK -  ProductsItemController.init. results: ", results);

                vm.is_page_loaded = true;

                vm.product = results.product;
                vm.transactions = results.transactions;
                // vm.mappings_products = results.mappings_products;

                // for(let item of results.products) {
                //     if(item.id == $stateParams.product_id) { continue; }

                //     let map_item = _.find(results.mappings_products, ['id', item.id]);

                //     if(map_item) {
                //         item.compatible = true;
                //         item.mapping_id = map_item.mapping_id;
                //     }
                    
                //     vm.products.push(item);
                // }
            })
            .catch(err => {
                logger.debug("+ERR - ProductsItemController.init. error: ", err);
                Flash.create("danger",err);
            });
    }
}