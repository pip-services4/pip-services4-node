"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpEndpoint = void 0;
/** @module controllers */
/** @hidden */
const fs = require("fs");
const restify = require("restify");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
const pip_services4_observability_node_2 = require("pip-services4-observability-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_config_node_1 = require("pip-services4-config-node");
const HttpResponseSender_1 = require("./HttpResponseSender");
/**
 * Used for creating HTTP endpoints. An endpoint is a URL, at which a given service can be accessed by a client.
 *
 * ### Configuration parameters ###
 *
 * Parameters to pass to the [[configure]] method for component configuration:
 *
 * - cors_headers - a comma-separated list of allowed CORS headers
 * - cors_origins - a comma-separated list of allowed CORS origins
 * - connection(s) - the connection resolver's connections:
 *     - "connection.discovery_key" - the key to use for connection resolving in a discovery service;
 *     - "connection.protocol" - the connection's protocol;
 *     - "connection.host" - the target host;
 *     - "connection.port" - the target port;
 *     - "connection.uri" - the target URI.
 * - credential - the HTTPS credentials:
 *     - "credential.ssl_key_file" - the SSL private key in PEM
 *     - "credential.ssl_crt_file" - the SSL certificate in PEM
 *     - "credential.ssl_ca_file" - the certificate authorities (root cerfiticates) in PEM
 *
 * ### References ###
 *
 * A logger, counters, and a connection resolver can be referenced by passing the
 * following references to the object's [[setReferences]] method:
 *
 * - logger: <code>"\*:logger:\*:\*:1.0"</code>;
 * - counters: <code>"\*:counters:\*:\*:1.0"</code>;
 * - discovery: <code>"\*:discovery:\*:\*:1.0"</code> (for the connection resolver).
 *
 * ### Examples ###
 *
 *     public MyMethod(_config: ConfigParams, _references: IReferences) {
 *         let endpoint = new HttpEndpoint();
 *         if (this._config)
 *             endpoint.configure(this._config);
 *         if (this._references)
 *             endpoint.setReferences(this._references);
 *         ...
 *
 *         await this._endpoint.open(context);
 *         this._opened = true;
 *         ...
 *     }
 */
class HttpEndpoint {
    constructor() {
        this._connectionResolver = new pip_services4_config_node_1.HttpConnectionResolver();
        this._logger = new pip_services4_observability_node_1.CompositeLogger();
        this._counters = new pip_services4_observability_node_2.CompositeCounters();
        this._maintenanceEnabled = false;
        this._fileMaxSize = 200 * 1024 * 1024;
        this._protocolUpgradeEnabled = false;
        this._registrations = [];
        this._allowedHeaders = ["trace_id"];
        this._allowedOrigins = [];
    }
    /**
     * Configures this HttpEndpoint using the given configuration parameters.
     *
     * __Configuration parameters:__
     * - __connection(s)__ - the connection resolver's connections;
     *     - "connection.discovery_key" - the key to use for connection resolving in a discovery service;
     *     - "connection.protocol" - the connection's protocol;
     *     - "connection.host" - the target host;
     *     - "connection.port" - the target port;
     *     - "connection.uri" - the target URI.
     *     - "credential.ssl_key_file" - SSL private key in PEM
     *     - "credential.ssl_crt_file" - SSL certificate in PEM
     *     - "credential.ssl_ca_file" - Certificate authority (root certificate) in PEM
     *
     * @param config    configuration parameters, containing a "connection(s)" section.
     *
     * @see [[https://pip-services4-node.github.io/pip-services4-commons-node/classes/config.configparams.html ConfigParams]] (in the PipServices "Commons" package)
     */
    configure(config) {
        config = config.setDefaults(HttpEndpoint._defaultConfig);
        this._connectionResolver.configure(config);
        this._maintenanceEnabled = config.getAsBooleanWithDefault('options.maintenance_enabled', this._maintenanceEnabled);
        this._fileMaxSize = config.getAsLongWithDefault('options.file_max_size', this._fileMaxSize);
        this._protocolUpgradeEnabled = config.getAsBooleanWithDefault('options.protocol_upgrade_enabled', this._protocolUpgradeEnabled);
        const headers = config.getAsStringWithDefault("cors_headers", "").split(",");
        for (let header of headers) {
            header = header.trim();
            if (header != "") {
                this._allowedHeaders = this._allowedHeaders.filter(h => h != header);
                this._allowedHeaders.push(header);
            }
        }
        const origins = config.getAsStringWithDefault("cors_origins", "").split(",");
        for (let origin of origins) {
            origin = origin.trim();
            if (origin != "") {
                this._allowedOrigins = this._allowedOrigins.filter(h => h != origin);
                this._allowedOrigins.push(origin);
            }
        }
    }
    /**
     * Sets references to this endpoint's logger, counters, and connection resolver.
     *
     * __References:__
     * - logger: <code>"\*:logger:\*:\*:1.0"</code>
     * - counters: <code>"\*:counters:\*:\*:1.0"</code>
     * - discovery: <code>"\*:discovery:\*:\*:1.0"</code> (for the connection resolver)
     *
     * @param references    an IReferences object, containing references to a logger, counters,
     *                      and a connection resolver.
     *
     * @see [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/refer.ireferences.html IReferences]] (in the PipServices "Commons" package)
     */
    setReferences(references) {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._connectionResolver.setReferences(references);
    }
    /**
     * Gets an HTTP server instance.
     * @returns an HTTP server instance of <code>null</code> if endpoint is closed.
     */
    getServer() {
        return this._server;
    }
    /**
     * @returns whether or not this endpoint is open with an actively listening REST server.
     */
    isOpen() {
        return this._server != null;
    }
    /**
     * Opens a connection using the parameters resolved by the referenced connection
     * resolver and creates a REST server (service) using the set options and parameters.
     *
     * @param context     (optional) a context to trace execution through call chain.
     */
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isOpen()) {
                return;
            }
            const connection = yield this._connectionResolver.resolve(context);
            this._uri = connection.getAsString("uri");
            const port = connection.getAsInteger("port");
            const host = connection.getAsString("host");
            try {
                const options = {};
                if (connection.getAsStringWithDefault('protocol', 'http') == 'https') {
                    const sslKeyFile = connection.getAsNullableString('ssl_key_file');
                    const privateKey = fs.readFileSync(sslKeyFile).toString();
                    const sslCrtFile = connection.getAsNullableString('ssl_crt_file');
                    const certificate = fs.readFileSync(sslCrtFile).toString();
                    const ca = [];
                    const sslCaFile = connection.getAsNullableString('ssl_ca_file');
                    if (sslCaFile != null) {
                        let caText = fs.readFileSync(sslCaFile).toString();
                        while (caText != null && caText.trim().length > 0) {
                            const crtIndex = caText.lastIndexOf('-----BEGIN CERTIFICATE-----');
                            if (crtIndex > -1) {
                                ca.push(caText.substring(crtIndex));
                                caText = caText.substring(0, crtIndex);
                            }
                        }
                    }
                    options.key = privateKey;
                    options.certificate = certificate;
                    //options.ca = ca;
                }
                options.handleUpgrades = this._protocolUpgradeEnabled;
                // Create instance of restify application   
                this._server = restify.createServer(options);
                // Configure restify application
                this._server.use(restify.plugins.acceptParser(this._server.acceptable));
                //this._server.use(restify.authorizationParser());
                //this._server.use(restify.CORS());
                this._server.use(restify.plugins.dateParser());
                this._server.use(restify.plugins.queryParser());
                this._server.use(restify.plugins.jsonp());
                this._server.use(restify.plugins.gzipResponse());
                this._server.use(restify.plugins.jsonBodyParser());
                // this._server.use(restify.plugins.bodyParser({ 
                //     maxFileSize: this._fileMaxSize
                // }));
                this._server.use(restify.plugins.conditionalRequest());
                //this._server.use(restify.plugins.requestExpiry());
                //if (options.get("throttle") != null)
                //     this._server.use(restify.plugins.throttle(options.get("throttle")));
                // Configure CORS requests
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const corsMiddleware = require('restify-cors-middleware2');
                let origins = this._allowedOrigins;
                if (origins.length == 0) {
                    origins = ["*"];
                }
                const cors = corsMiddleware({
                    preflightMaxAge: 5,
                    origins: origins,
                    allowHeaders: this._allowedHeaders,
                    exposeHeaders: this._allowedHeaders,
                    allowCredentialsAllOrigins: origins[0] == '*' ? true : false
                });
                this._server.pre(cors.preflight);
                this._server.use(cors.actual);
                // fixed bug with return header for restify-cors-middleware
                this._server.pre((req, res, next) => {
                    res.header("Access-Control-Allow-Origin", origins.join(','));
                    next();
                });
                this._server.use((req, res, next) => { this.addCompatibility(req, res, next); });
                this._server.use((req, res, next) => { this.noCache(req, res, next); });
                this._server.use((req, res, next) => { this.doMaintenance(req, res, next); });
                this.performRegistrations();
                yield new Promise((resolve, reject) => {
                    this._server.listen(port, host, (err) => {
                        if (err == null)
                            resolve(null);
                        else
                            reject(err);
                    });
                });
                // Register the service URI
                yield this._connectionResolver.register(context);
                this._logger.debug(context, "Opened REST service at %s", this._uri);
            }
            catch (ex) {
                this._server = null;
                throw new pip_services4_commons_node_1.ConnectionException(context != null ? context.getTraceId() : null, "CANNOT_CONNECT", "Opening REST service failed").wrap(ex).withDetails("url", this._uri);
            }
        });
    }
    addCompatibility(req, res, next) {
        req.param = (name) => {
            if (req.query) {
                const param = req.query[name];
                if (param)
                    return param;
            }
            if (req.body) {
                const param = req.body[name];
                if (param)
                    return param;
            }
            if (req.params) {
                const param = req.params[name];
                if (param)
                    return param;
            }
            return null;
        };
        req.route.params = req.params;
        next();
    }
    // Prevents IE from caching REST requests
    noCache(req, res, next) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
        next();
    }
    // Returns maintenance error code
    doMaintenance(req, res, next) {
        // Make this more sophisticated
        if (this._maintenanceEnabled) {
            res.header('Retry-After', 3600);
            res.json(503);
            return;
        }
        next();
    }
    /**
     * Closes this endpoint and the REST server (service) that was opened earlier.
     *
     * @param context     (optional) a context to trace execution through call chain.
     */
    close(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._server != null) {
                try {
                    this._server.close();
                    this._logger.debug(context, "Closed REST service at %s", this._uri);
                }
                catch (ex) {
                    // Eat exceptions
                    this._logger.warn(context, "Failed while closing REST service: %s", ex);
                }
                this._server = null;
                this._uri = null;
            }
        });
    }
    /**
     * Registers a registerable object for dynamic endpoint discovery.
     *
     * @param registration      the registration to add.
     *
     * @see [[IRegisterable]]
     */
    register(registration) {
        this._registrations.push(registration);
    }
    /**
     * Unregisters a registerable object, so that it is no longer used in dynamic
     * endpoint discovery.
     *
     * @param registration      the registration to remove.
     *
     * @see [[IRegisterable]]
     */
    unregister(registration) {
        this._registrations = this._registrations.filter(r => r != registration);
    }
    performRegistrations() {
        for (const registration of this._registrations) {
            registration.register();
        }
    }
    fixRoute(route) {
        if (route && route.length > 0 && !route.startsWith("/")) {
            route = "/" + route;
        }
        return route;
    }
    /**
     * Returns context from request
     * @param req -  http request
     * @return Returns context from request
     */
    getTraceId(req) {
        let traceId = req.query.trace_id || req.query.correlation_id;
        if (traceId == null || traceId == "") {
            traceId = req.headers['trace_id'] || req.headers['correlation_id'];
        }
        return traceId;
    }
    /**
     * Registers an action in this objects REST server (service) by the given method and route.
     *
     * @param method        the HTTP method of the route.
     * @param route         the route to register in this object's REST server (service).
     * @param schema        the schema to use for parameter validation.
     * @param action        the action to perform at the given route.
     */
    registerRoute(method, route, schema, action) {
        method = method.toLowerCase();
        if (method == 'delete')
            method = 'del';
        route = this.fixRoute(route);
        const asyncWrap = (fn) => {
            return (req, res, next) => {
                Promise.resolve(fn(req, res, next)).catch(next);
            };
        };
        // Hack!!! Wrapping action to preserve prototyping conte
        const actionCurl = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Perform validation
            if (schema != null) {
                const params = Object.assign({}, req.params, req.query, { body: req.body });
                const traceId = this.getTraceId(req);
                const err = schema.validateAndReturnException(traceId, params, false);
                if (err != null) {
                    new Promise((resolve) => {
                        resolve(HttpResponseSender_1.HttpResponseSender.sendError(req, res, err));
                    }).then(() => next());
                    return;
                }
            }
            // Todo: perform verification?
            yield action(req, res);
            // next();
        });
        // Wrapping to preserve "this"
        // eslint-disable-next-line @typescript-eslint/no-this-alias, @typescript-eslint/no-unused-vars
        const self = this;
        this._server[method](route, asyncWrap(actionCurl));
    }
    /**
     * Registers an action with authorization in this objects REST server (service)
     * by the given method and route.
     *
     * @param method        the HTTP method of the route.
     * @param route         the route to register in this object's REST server (service).
     * @param schema        the schema to use for parameter validation.
     * @param authorize     the authorization interceptor
     * @param action        the action to perform at the given route.
     */
    registerRouteWithAuth(method, route, schema, authorize, action) {
        if (authorize) {
            const nextAction = action;
            action = (req, res) => __awaiter(this, void 0, void 0, function* () {
                yield authorize(req, res, () => __awaiter(this, void 0, void 0, function* () { yield nextAction(req, res); }));
            });
        }
        this.registerRoute(method, route, schema, action);
    }
    /**
     * Registers a middleware action for the given route.
     *
     * @param route         the route to register in this object's REST server (service).
     * @param action        the middleware action to perform at the given route.
     */
    registerInterceptor(route, action) {
        route = this.fixRoute(route);
        this._server.use((req, res, next) => {
            const match = (req.url.match(route) || []).length > 0;
            if (route != null && route != "" && !match)
                next();
            else
                action(req, res, next);
        });
    }
}
exports.HttpEndpoint = HttpEndpoint;
HttpEndpoint._defaultConfig = pip_services4_components_node_1.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "0.0.0.0", "connection.port", 3000, "credential.ssl_key_file", null, "credential.ssl_crt_file", null, "credential.ssl_ca_file", null, "options.maintenance_enabled", false, "options.request_max_size", 1024 * 1024, "options.file_max_size", 200 * 1024 * 1024, "options.connect_timeout", 60000, "options.debug", true);
//# sourceMappingURL=HttpEndpoint.js.map