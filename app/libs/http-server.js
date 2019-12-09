'use strict';

let log                 = require("debug")(`Pid: ${process.pid} Http:log`),
    error               = require("debug")(`Pid: ${process.pid} Http:error`),
    config              = require("../config/config"),
    cors                = require('cors'),
    express             = require('express'),
    morgan              = require('morgan'),
    app                 = express(),
    bearerToken         = require('express-bearer-token'),
    swaggerTools        = require('swagger-tools'),
    jsyaml              = require('js-yaml'),
    fs                  = require('fs'),
    path                = require("path"),
    swagger_path        = path.resolve(__dirname, "../"+config.server.swagger_path),
    controllers_path    = path.resolve(__dirname, "../"+config.server.controllers_path);

class Http {
    constructor() {

        if (!config.server ||
            !config.server.port ||
            !config.server.swagger_path ||
            !config.server.controllers_path) {

            log("+OK - constructor. Config file is not valid");
            return process.exit();
        }

        log("+OK - constructor is initialized");

        this.server = null;
        // swaggerRouter configuration
        this.options = {
            swaggerUi: '/swagger.json',
            controllers: controllers_path,
            useStubs: process.env.NODE_ENV !== 'production' // Conditionally turn on stubs (mock mode)
        };
        this.spec = fs.readFileSync(swagger_path, 'utf8');
        this.swaggerDoc = jsyaml.safeLoad(this.spec);
    }

    /**
     * Initialize server
     *
     * @param cb
     */
    initServer(cb) {
        log("+OK - initServer. morgan mode: %s", process.env.NODE_ENV === 'production' ? 'combined' : 'dev');

        // Define level for morgan messages
        const morgan_level = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

        // Define different streams for successful requests and for unsuccessful ones
        app.use(morgan(morgan_level, {
            skip: (req, res) => { return res.statusCode < 400; },
            stream: { write: message => error(message) }
        }));
        app.use(morgan(morgan_level, {
            skip: (req, res) => { return res.statusCode >= 400; },
            stream: { write: message => log(message) }
        }));

        app.set('port', process.env.PORT || config.server.port);
        app.use(cors());
        app.use(bearerToken());

        app.use(express.static(__dirname + '/../public'));
        app.use('/documentation', express.static(__dirname + '/../docs/server'))

        // Initialize the Swagger middleware
        swaggerTools.initializeMiddleware(this.swaggerDoc, middleware => {
            // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
            app.use(middleware.swaggerMetadata());

            // app.use(middleware.swaggerSecurity({
            //     Bearer: (req, def, token, next) => {
            //
            //         log("Bearer. token: %s req.requiredScopes: %j def: %j", req.token, req.requiredScopes, def);
            //
            //         jwt.verify(req.token, config.token.secret_key, (verification_error, decoded_token) => {
            //
            //             //check if the JWT was verified correctly
            //             if (verification_error || !decoded_token) {
            //                 error("+ERR - swaggerSecurity. verification_error: %j", verification_error);
            //                 return next(new Error("E_NOT_TOKEN"));
            //             }
            //
            //             req.decoded_token = decoded_token;
            //
            //             next();
            //         });
            //     }
            // }));

            // Validate Swagger requests
            app.use(middleware.swaggerValidator({
                validateResponse: false
            }));

            // Route validated requests to appropriate controller
            app.use(middleware.swaggerRouter(this.options));

            // Serve the Swagger documents and Swagger UI
            app.use(middleware.swaggerUi());

            // Handler for errors
            app.use(require("./http-error"));

            // Variable to prevent a callback to be called twice
            let is_callback_called = false;

            this.server = app.listen(app.get('port'), () => {
                log('+OK - initServer. listening on port %d', app.get('port'));


                if(cb && !is_callback_called) {
                    is_callback_called = true;
                    cb();
                }
            }).on('error', err => {
                error('+ERR - initServer. Can not start http server on port %d err: %j', app.get('port'), err);

                if(cb && !is_callback_called) {
                    is_callback_called = true;
                    cb(err);
                }
            });
        });
    }

    close(cb) {
        log("+OK - close");

        if(!this.server || !this.server.listening) {
            return cb();
        }

        this.server.close(cb);
    }
}

module.exports = new Http();