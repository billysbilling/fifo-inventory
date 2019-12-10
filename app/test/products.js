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
 
    let prod_id, 
        trans_buy_id, 
        trans_sell_id;

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
                price:  10
            };
            chai.request(server_address)
                .put('/products')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it('it should not PUT /products without price', done => {
            let product = {
                name:  "Prod Name"
            };
            chai.request(server_address)
                .put('/products')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it('it should not PUT /products with invalid price type', done => {
            let product = {
                price:  "Prod Name"
            };
            chai.request(server_address)
                .put('/products')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it('it should not PUT /products with invalid name type', done => {
            let product = {
                name:  0
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
                name:   "Prodname",
                price:  10
            };
            chai.request(server_address)
                .put('/products')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(200);
                    prod_id = res.body.id;
                    done();
                });
        });
 
        it('it should not GET /products/asd', done => {
 
            chai.request(server_address)
                .get('/products/asd')
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });

        it('it should not GET /products/0', done => {
 
            chai.request(server_address)
                .get('/products/0')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        it('it should GET /products/<id>', done => {
 
            chai.request(server_address)
                .get('/products/'+prod_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.name.should.eql("Prodname");
                    res.body.price.should.eql(10);
                    done();
                });
        });
    });
 
    /*
     * Test updating product
     */
    describe('/PUT /products/<id>', () => {
 
        it('it should not PUT /products/<id> without name', done => {
            let product = {
                price:  1
            };
            chai.request(server_address)
                .put('/products/'+prod_id)
                .send(product)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it('it should not PUT /products/<id> without price', done => {
            let product = {
                name:  "Prod name"
            };
            chai.request(server_address)
                .put('/products/'+prod_id)
                .send(product)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
 
        it('it should not PUT /products/<id> with wrong product_id', done => {
            let product = {
                price:  1,
                name:  "Prod name"
            };
            chai.request(server_address)
                .put('/products/asd')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
 
        it('it should PUT /products/<id>', done => {
            let product = {
                name:   "Prodname 2",
                price:  20   
            };
            chai.request(server_address)
                .put('/products/'+prod_id)
                .send(product)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should GET /products/<id>', done => {
 
            chai.request(server_address)
                .get('/products/'+prod_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.name.should.eql("Prodname 2");
                    res.body.price.should.eql(20);
                    done();
                });
        });
    });

    /*
     * Test buying products
     */
    describe('/PUT /products/<id>/buy', () => {
 
        it('it should not PUT /products/<id>/buy with invalid id', done => {
            
            let fields = {
                "quantity": 10,
                "date":     "2019-01-01 00:00:00"
            };            
            chai.request(server_address)
                .put('/products/asd/buy')
                .send(fields)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it('it should not PUT /products/<id>/buy for product which doesn\'t exist', done => {
            
            let fields = {
                "quantity": 10,
                "date":     "2019-01-01 00:00:00"
            };            
            chai.request(server_address)
                .put('/products/0/buy')
                .send(fields)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        it('it should PUT /products/<id>/buy', done => {
            
            let fields = {
                "quantity": 10,
                "date":     "2019-02-01 00:00:00"
            };            
            chai.request(server_address)
                .put('/products/'+prod_id+'/buy')
                .send(fields)
                .end((err, res) => {
                    res.should.have.status(200);
                    trans_buy_id = res.body.trans_id;
                    done();
                });
        });

        it('it should GET /transactions/<id>', done => {
 
            chai.request(server_address)
                .get('/transactions/'+trans_buy_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.quantity.should.eql(10);
                    res.body.date.should.eql("2019-02-01T00:00:00.000Z");
                    done();
                });
        });

        it('it should GET /products/<id>', done => {
 
            chai.request(server_address)
                .get('/products/'+prod_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.quantity.should.eql(10);
                    done();
                });
        });
    });

    /*
     * Test selling products
     */
    describe('/PUT /products/<id>/sell', () => {
 
        it('it should not PUT /products/<id>/sell with invalid id', done => {
            
            let fields = {
                "quantity": 10,
                "date":     "2019-01-01 00:00:00"
            };            
            chai.request(server_address)
                .put('/products/asd/sell')
                .send(fields)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it('it should not PUT /products/<id>/sell for product which doesn\'t exist', done => {
            
            let fields = {
                "quantity": 10,
                "date":     "2019-01-01 00:00:00"
            };            
            chai.request(server_address)
                .put('/products/0/sell')
                .send(fields)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        it('it should PUT /products/<id>/sell', done => {
            
            let fields = {
                "quantity": 2,
                "date":     "2019-01-01 00:00:00"
            };            
            chai.request(server_address)
                .put('/products/'+prod_id+'/sell')
                .send(fields)
                .end((err, res) => {
                    res.should.have.status(200);
                    trans_sell_id = res.body.trans_id;
                    done();
                });
        });

        it('it should GET /transactions/<id>', done => {
 
            chai.request(server_address)
                .get('/transactions/'+trans_sell_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.quantity.should.eql(-2);
                    res.body.date.should.eql("2019-01-01T00:00:00.000Z");
                    done();
                });
        });

        it('it should GET /products/<id>', done => {
 
            chai.request(server_address)
                .get('/products/'+prod_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.quantity.should.eql(8);
                    done();
                });
        });
    });
 
    /*
     * Test deleting product
     */
    describe('/DELETE /products/<id>', () => {
 
        it('it should not DELETE /products/<id> with invalid product_id', done => {
            chai.request(server_address)
                .delete('/products/asd')
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
 
        it('it should DELETE /products/<id>', done => {
            chai.request(server_address)
                .delete('/products/'+prod_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should not GET /products/<id>', done => {
 
            chai.request(server_address)
                .get('/products/'+prod_id)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    /*
     * Test deleting transactions
     */
    describe('/DELETE /transactions/<id>', () => {
 
        it('it should not DELETE /transactions/<id> with invalid transaction_id', done => {
            chai.request(server_address)
                .delete('/transactions/asd')
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
 
        it('it should DELETE /transactions/<id>', done => {
            chai.request(server_address)
                .delete('/transactions/'+trans_buy_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should not GET /transactions/<id>', done => {
 
            chai.request(server_address)
                .get('/transactions/'+trans_buy_id)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('it should DELETE /transactions/<id>', done => {
            chai.request(server_address)
                .delete('/transactions/'+trans_sell_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should not GET /transactions/<id>', done => {
 
            chai.request(server_address)
                .get('/transactions/'+trans_sell_id)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});