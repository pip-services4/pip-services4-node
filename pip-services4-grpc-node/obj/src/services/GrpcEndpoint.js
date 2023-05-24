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
exports.GrpcEndpoint = void 0;
/** @module services */
/** @hidden */
const fs = require('fs');
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_components_node_1 = require("pip-services4-components-node");
const pip_services3_components_node_2 = require("pip-services4-components-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const pip_services3_commons_node_3 = require("pip-services4-commons-node");
const pip_services3_commons_node_4 = require("pip-services4-commons-node");
const pip_services3_rpc_node_1 = require("pip-services4-rpc-node");
/**
 * Used for creating GRPC endpoints. An endpoint is a URL, at which a given service can be accessed by a client.
 *
 * ### Configuration parameters ###
 *
 * Parameters to pass to the [[configure]] method for component configuration:
 *
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
 *         await this._endpoint.open(correlationId);
 *     }
 */
class GrpcEndpoint {
    constructor() {
        this._connectionResolver = new pip_services3_rpc_node_1.HttpConnectionResolver();
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._counters = new pip_services3_components_node_2.CompositeCounters();
        this._maintenanceEnabled = false;
        this._fileMaxSize = 200 * 1024 * 1024;
        this._registrations = [];
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
        config = config.setDefaults(GrpcEndpoint._defaultConfig);
        this._connectionResolver.configure(config);
        this._maintenanceEnabled = config.getAsBooleanWithDefault('options.maintenance_enabled', this._maintenanceEnabled);
        this._fileMaxSize = config.getAsLongWithDefault('options.file_max_size', this._fileMaxSize);
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
     * @returns whether or not this endpoint is open with an actively listening GRPC server.
     */
    isOpen() {
        return this._server != null;
    }
    //TODO: check for correct understanding.
    /**
     * Opens a connection using the parameters resolved by the referenced connection
     * resolver and creates a GRPC server (service) using the set options and parameters.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     */
    open(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isOpen()) {
                return;
            }
            let connection = yield this._connectionResolver.resolve(correlationId);
            this._uri = connection.getAsString("uri");
            try {
                let options = {};
                if (connection.getAsStringWithDefault("protocol", 'http') == 'https') {
                    let sslKeyFile = connection.getAsNullableString('ssl_key_file');
                    let privateKey = fs.readFileSync(sslKeyFile).toString();
                    let sslCrtFile = connection.getAsNullableString('ssl_crt_file');
                    let certificate = fs.readFileSync(sslCrtFile).toString();
                    let ca = [];
                    let sslCaFile = connection.getAsNullableString('ssl_ca_file');
                    if (sslCaFile != null) {
                        let caText = fs.readFileSync(sslCaFile).toString();
                        while (caText != null && caText.trim().length > 0) {
                            let crtIndex = caText.lastIndexOf('-----BEGIN CERTIFICATE-----');
                            if (crtIndex > -1) {
                                ca.push(caText.substring(crtIndex));
                                caText = caText.substring(0, crtIndex);
                            }
                        }
                    }
                    options.kvpair = {
                        'private_key': privateKey,
                        'cert_chain': certificate
                    };
                    options.ca = ca;
                }
                // Create instance of express application   
                let grpc = require('@grpc/grpc-js');
                this._server = new grpc.Server();
                let credentials = connection.getAsStringWithDefault("protocol", 'http') == 'https'
                    ? grpc.ServerCredentials.createSsl(options.ca, options.kvpair)
                    : grpc.ServerCredentials.createInsecure();
                yield new Promise((resolve, reject) => {
                    this._server.bindAsync(connection.getAsString("host") + ":" + connection.getAsInteger("port"), credentials, (err) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                });
                // Register the service URI
                yield this._connectionResolver.register(correlationId);
                this._logger.debug(correlationId, "Opened GRPC service at %s", this._uri);
                // Start operations
                this.performRegistrations();
                this._server.start();
            }
            catch (ex) {
                this._server = null;
                throw new pip_services3_commons_node_3.ConnectionException(correlationId, "CANNOT_CONNECT", "Opening GRPC service failed").wrap(ex).withDetails("url", this._uri);
            }
        });
    }
    /**
     * Closes this endpoint and the GRPC server (service) that was opened earlier.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     */
    close(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._server != null) {
                this._uri = null;
                this._commandableMethods = null;
                this._commandableSchemas = null;
                this._commandableService = null;
                // Eat exceptions
                try {
                    yield new Promise((resolve, reject) => {
                        this._server.tryShutdown((err) => {
                            if (err != null) {
                                reject(err);
                                return;
                            }
                            resolve();
                        });
                    });
                    this._logger.debug(correlationId, "Closed GRPC service at %s", this._uri);
                    this._server = null;
                }
                catch (ex) {
                    this._logger.warn(correlationId, "Failed while closing GRPC service: %s", ex);
                    throw ex;
                }
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
        for (let registration of this._registrations) {
            registration.register();
        }
        this.registerCommandableService();
    }
    registerCommandableService() {
        if (this._commandableMethods == null)
            return;
        let grpc = require('@grpc/grpc-js');
        let protoLoader = require('@grpc/proto-loader');
        let options = {
            keepCase: true,
            // longs: String,
            // enums: String,
            defaults: true,
            oneofs: true
        };
        let packageDefinition = protoLoader.loadSync(__dirname + "../../../../src/protos/commandable.proto", options);
        let packageObject = grpc.loadPackageDefinition(packageDefinition);
        let service = packageObject.commandable.Commandable.service;
        this.registerService(service, {
            invoke: (call, callback) => {
                this.invokeCommandableMethod(call)
                    .then((result) => {
                    callback(null, result);
                })
                    .catch((err) => {
                    callback(err, null);
                });
            }
        });
    }
    invokeCommandableMethod(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let method = call.request.method;
            let action = this._commandableMethods ? this._commandableMethods[method] : null;
            let correlationId = call.request.correlation_id;
            // Handle method not found
            if (action == null) {
                let err = new pip_services3_commons_node_4.InvocationException(correlationId, "METHOD_NOT_FOUND", "Method " + method + " was not found").withDetails("method", method);
                let response = {
                    error: pip_services3_commons_node_2.ErrorDescriptionFactory.create(err),
                    result_empty: true,
                    result_json: null
                };
                return response;
            }
            return yield action(call);
        });
    }
    /**
     * Registers a service with related implementation
     *
     * @param service        a GRPC service object.
     * @param implementation the service implementation methods.
     */
    registerService(service, implementation) {
        this._server.addService(service, implementation);
    }
    /**
     * Registers a commandable method in this objects GRPC server (service) by the given name.,
     *
     * @param method        the GRPC method name.
     * @param schema        the schema to use for parameter validation.
     * @param action        the action to perform at the given route.
     */
    registerCommadableMethod(method, schema, action) {
        this._commandableMethods = this._commandableMethods || {};
        this._commandableMethods[method] = action;
        this._commandableSchemas = this._commandableSchemas || {};
        this._commandableSchemas[method] = schema;
    }
}
exports.GrpcEndpoint = GrpcEndpoint;
GrpcEndpoint._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "0.0.0.0", "connection.port", 3000, "credential.ssl_key_file", null, "credential.ssl_crt_file", null, "credential.ssl_ca_file", null, "options.maintenance_enabled", false, "options.request_max_size", 1024 * 1024, "options.file_max_size", 200 * 1024 * 1024, "options.connect_timeout", 60000, "options.debug", true);
//# sourceMappingURL=GrpcEndpoint.js.map