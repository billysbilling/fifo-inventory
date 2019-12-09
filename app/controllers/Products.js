'use strict';

let ProductsController = require('./ProductsController');

module.exports.productsGET = function(req, res, next) {
    ProductsController.productsGET(req, res, next);
};

module.exports.productidGET = function(req, res, next) {
    ProductsController.productidGET(req, res, next);
};

module.exports.productidPUT = function(req, res, next) {
    ProductsController.productidPUT(req, res, next);
};

module.exports.productidDELETE = function(req, res, next) {
    ProductsController.productidDELETE(req, res, next);
};

module.exports.productsPUT = function(req, res, next) {
    ProductsController.productsPUT(req, res, next);
};

module.exports.productidbuyPUT = function(req, res, next) {
    ProductsController.productidbuyPUT(req, res, next);
};

module.exports.productidsellPUT = function(req, res, next) {
    ProductsController.productidsellPUT(req, res, next);
};