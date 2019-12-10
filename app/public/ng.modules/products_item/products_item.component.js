'use strict';

angular
    .module('codeChal.products_item', [
        'codeChal.productService',
        'codeChal.transactionService',
        'codeChal.taskService',
    ])
    .component('productsItem', {
        templateUrl: 'ng.modules/products_item/products_item.view.html',
        controller: ProductsItemController
    });

ProductsItemController.$inject = ['$state', '$stateParams', 'ProductService', 'TransactionService', 'TaskService', 'moment', 'Flash', '$log', '$q'];

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
function ProductsItemController($state, $stateParams, ProductService, TransactionService, TaskService, moment, Flash, logger, $q) {
    logger.debug("+OK - ProductsItemController. "+$stateParams.product_id);

    var vm = this;

    if(!$stateParams.product_id) {
        $state.go("products_list");
        return;
    }

    vm.is_data_loading = false;
    vm.is_transaction_loading = false;
    vm.is_page_loaded = false;

    vm.product = null;
    vm.transactions = [];

    vm.dtPopup = {
        opened: false
    };

    // vm.getPage          = getPage;
    vm.update               = update;
    vm.remove               = remove;
    vm.openDatePicker       = openDatePicker;
    vm.addTransaction       = addTransaction;
    vm.removeTransaction    = removeTransaction;
    vm.taskStart            = taskStart;

    vm.datePickerOptions = {
        formatYear: 'yy',
        maxDate: new Date(2028, 1, 1),
        minDate: new Date(1900, 1, 1),
        startingDay: 1
    };

    init();

    /////////////////////
    // Implementations
    /////////////////////

    function openDatePicker() {
        vm.dtPopup.opened = true;
    }

    function taskStart(task_id, date) {
        logger.debug("+OK - ProductsItemController.taskStart. task_id" + task_id + " date: " + date);
        TaskService.performTask({
            task_id:    task_id,
            date:       moment(date).format("YYYY-MM-DD HH:mm:ss")
        })
            .then(function(data) {
                logger.debug("+OK - ProductsItemController.taskStart. data: ",  data);
                vm["task"+task_id+"_res"] = data.result || 0;
            })
            .catch(err => {
                logger.debug("+ERR - ProductsItemController.addTransaction. error: ", err);
                Flash.create("danger",err.data.message);
            });
    }

    function remove() {
        logger.debug("+OK - ProductsItemController.remove", vm.product);
        vm.is_data_loading = true;

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
    function removeTransaction(id) {
        logger.debug("+OK - removeTransaction id", id);
        vm.is_transaction_loading = true;

        TransactionService.removeTransaction(id)
            .then(function(result) {
                vm.is_transaction_loading = false;
                init();
            })
            .catch(err => {
                logger.debug("+ERR - ProductsItemController.removeTransaction. error: ", err);
                Flash.create("danger",err);
            });
    }

    function update() {
        logger.debug("+OK - ProductsItemController.update. vm.product: ", vm.product);
        vm.is_data_loading = true;

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

    function addTransaction() {
        logger.debug("+OK - ProductsItemController.addTransaction. vm.transaction: ", vm.transaction);
        vm.is_transaction_loading = true;

        if(vm.transaction.type == 'buy') {
            var buy_product_fields = {
                date: moment(vm.transaction.date).format("YYYY-MM-DD HH:mm:ss"),
                quantity: vm.transaction.quantity
            };

            logger.debug("+OK - ProductsItemController.addTransaction. buy_product_fields: ", buy_product_fields);
            ProductService.buyProduct($stateParams.product_id, buy_product_fields)
                .then(function(result) {
                    vm.is_transaction_loading = false;
                    Flash.create("success", "Transaction has been added successfully");
                    vm.transaction = {};
                    init();
                })
                .catch(err => {
                    logger.debug("+ERR - ProductsItemController.addTransaction. error: ", err);
                    Flash.create("danger",err.data.message);
                });
        } else if(vm.transaction.type == 'sell') {
            var sell_product_fields = {
                date: moment(vm.transaction.date).format("YYYY-MM-DD HH:mm:ss"),
                quantity: vm.transaction.quantity
            };

            logger.debug("+OK - ProductsItemController.addTransaction. sell_product_fields: ", sell_product_fields);
            ProductService.sellProduct($stateParams.product_id, sell_product_fields)
                .then(function(result) {
                    vm.is_transaction_loading = false;
                    Flash.create("success", "Transaction has been added successfully");
                    vm.transaction = {};
                    init();
                })
                .catch(err => {
                    logger.debug("+ERR - ProductsItemController.addTransaction. error: ", err);
                    Flash.create("danger",err.data.message);
                });
        }
    }

    function init() {
        logger.debug("Init");

        $q.all({
            "product":      ProductService.getProductById($stateParams.product_id),
            "transactions": TransactionService.getTransactions()
        })
            .then(function(results) {
                logger.debug("+OK -  ProductsItemController.init. results: ", results);

                vm.is_page_loaded = true;

                vm.product = results.product;
                vm.transactions = results.transactions;
            })
            .catch(err => {
                logger.debug("+ERR - ProductsItemController.init. error: ", err);
                Flash.create("danger", "Can't request data");
            });
    }
}