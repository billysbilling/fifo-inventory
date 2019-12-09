'use strict';

angular.module('codeChal', [

    // import products modules
    'codeChal.products_list',
    'codeChal.products_item',
    'codeChal.products_new',

    // libraries
    'ui.router',
    'angularMoment',
    'ui.bootstrap',
    'ngFlash',
    'ngAnimate',
])
    .config(['$stateProvider', '$urlRouterProvider', '$logProvider', 'FlashProvider',
        function($stateProvider, $urlRouterProvider, $logProvider, FlashProvider) {

            // FlashProvider.setTimeout(0);

            $logProvider.debugEnabled(localStorage.getItem("debug") == 1);

            $stateProvider

                ///////////////////
                // Products
                ///////////////////
                .state("products_list", {
                    url:        "/products/list",
                    template:   "<products-list></products-list>"
                })
                .state("products_item", {
                    url:        "/products/item/?product_id",
                    template:   "<products-item></products-item>"
                })
                .state("products_new", {
                    url:        "/products/new",
                    template:   "<products-new></products-new>"
                })

            // Send to login if the URL was not found
            $urlRouterProvider.otherwise("/products/list");
        }
    ])
    .run(['$rootScope', '$state', '$log',
        function ($rootScope, $state, logger) {

        }
    ]);

function setDebug(val) {
    localStorage.setItem("debug", val);
    window.location.reload();
}