//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
 
let express         = require("express"),
    log             = require("debug")('ProductsTest:log'),
    error           = require("debug")('ProductsTest:error'),
    config          = require("../config/config"),
    // server          = require("../server"),
    chai            = require('chai'),
    chaiHttp        = require('chai-http'),
    should          = chai.should();
 
// Specifiy server_address address
let server_address = "http://127.0.0.1:"+ config.server.port;
 
chai.use(chaiHttp);
 
//Our parent block
describe('Products', () => {
 
    /*
     * Test getting all products
     */
    describe('/GET /products', () => {
 
        it('it should GET list of products', done => {
            chai.request(server_address)
                .get('/products')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });
 
    /*
     * Test creating product
     */
    describe('/PUT /products', () => {
 
        it('it should not PUT /products without name', done => {
            let product = {
                // name:   "TestName",
                serial_number:  "TestSerialNumber",
                manufactorer:   "TestManufactorer",
                weight:         1
            };
            chai.request(server_address)
                .put('/products')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
 
        it('it should PUT /products', done => {
            let product = {
                name:           "TestName",
                serial_number:  "TestSerialNumber",
                manufactorer:   "TestManufactorer",
                weight:         1
            };
            chai.request(server_address)
                .put('/products')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
 
        it('it should GET /products/1', done => {
 
            chai.request(server_address)
                .get('/products/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
 
    /*
     * Test updating product
     */
    describe('/PUT /products/1', () => {
 
        it('it should not PUT /products/1 without name', done => {
            let product = {
                // name:   "TestName",
                serial_number:  "TestSerialNumber2",
                manufactorer:   "TestManufactorer2",
                weight:         1
            };
            chai.request(server_address)
                .put('/products/1')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
 
        it('it should not PUT /products with wrong product_id', done => {
            let product = {
                // name:   "TestName",
                serial_number:  "TestSerialNumber2",
                manufactorer:   "TestManufactorer2",
                weight:         1
            };
            chai.request(server_address)
                .put('/products/asd')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
 
        it('it should PUT /products', done => {
            let product = {
                name:           "TestName",
                serial_number:  "TestSerialNumber2",
                manufactorer:   "TestManufactorer2",
                weight:         1
            };
            chai.request(server_address)
                .put('/products/1')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
 
    /*
     * Test deleting product
     */
    describe('/DELETE /products/1', () => {
 
        it('it should not DELETE /products/1 with invalid product_id', done => {
            chai.request(server_address)
                .delete('/products/asd')
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
 
        it('it should DELETE /products/1 ', done => {
            chai.request(server_address)
                .delete('/products/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});