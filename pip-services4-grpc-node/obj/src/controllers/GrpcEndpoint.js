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
/** @module controllers */
/** @hidden */
const fs = require("fs");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
const pip_services4_observability_node_2 = require("pip-services4-observability-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_commons_node_2 = require("pip-services4-commons-node");
const pip_services4_commons_node_3 = require("pip-services4-commons-node");
const pip_services4_config_node_1 = require("pip-services4-config-node");
/**
 * Used for creating GRPC endpoints. An endpoint is a URL, at which a given controller can be accessed by a client.
 *
 * ### Configuration parameters ###
 *
 * Parameters to pass to the [[configure]] method for component configuration:
 *
 * - connection(s) - the connection resolver's connections:
 *     - "connection.discovery_key" - the key to use for connection resolving in a discovery controller;
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
 *     }
 */
class GrpcEndpoint {
    constructor() {
        this._connectionResolver = new pip_services4_config_node_1.HttpConnectionResolver();
        this._logger = new pip_services4_observability_node_1.CompositeLogger();
        this._counters = new pip_services4_observability_node_2.CompositeCounters();
        this._maintenanceEnabled = false;
        this._fileMaxSize = 200 * 1024 * 1024;
        this._registrations = [];
    }
    /**
     * Configures this HttpEndpoint using the given configuration parameters.
     *
     * __Configuration parameters:__
     * - __connection(s)__ - the connection resolver's connections;
     *     - "connection.discovery_key" - the key to use for connection resolving in a discovery controller;
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
     * @param context     (optional) a context to trace execution through call chain.
     */
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isOpen()) {
                return;
            }
            const connection = yield this._connectionResolver.resolve(context);
            this._uri = connection.getAsString("uri");
            try {
                const options = {};
                if (connection.getAsStringWithDefault("protocol", 'http') == 'https') {
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
                    options.kvpair = {
                        'private_key': privateKey,
                        'cert_chain': certificate
                    };
                    options.ca = ca;
                }
                // Create instance of express application   
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const grpc = require('@grpc/grpc-js');
                this._server = new grpc.Server();
                const credentials = connection.getAsStringWithDefault("protocol", 'http') == 'https'
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
                yield this._connectionResolver.register(context);
                this._logger.debug(context, "Opened GRPC service at %s", this._uri);
                // Start operations
                this.performRegistrations();
                this._server.start();
            }
            catch (ex) {
                this._server = null;
                throw new pip_services4_commons_node_2.ConnectionException(context != null ? context.getTraceId() : null, "CANNOT_CONNECT", "Opening GRPC service failed").wrap(ex).withDetails("url", this._uri);
            }
        });
    }
    /**
     * Closes this endpoint and the GRPC server (controller) that was opened earlier.
     *
     * @param context     (optional) a context to trace execution through call chain.
     */
    close(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._server != null) {
                this._uri = null;
                this._commandableMethods = null;
                this._commandableSchemas = null;
                this._commandableController = null;
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
                    this._logger.debug(context, "Closed GRPC service at %s", this._uri);
                    this._server = null;
                }
                catch (ex) {
                    this._logger.warn(context, "Failed while closing GRPC service: %s", ex);
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
        for (const registration of this._registrations) {
            registration.register();
        }
        this.registerCommandableController();
    }
    registerCommandableController() {
        if (this._commandableMethods == null)
            return;
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const grpc = require('@grpc/grpc-js');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const protoLoader = require('@grpc/proto-loader');
        const options = {
            keepCase: true,
            // longs: String,
            // enums: String,
            defaults: true,
            oneofs: true
        };
        const packageDefinition = protoLoader.loadSync(__dirname + "../../../../src/protos/commandable.proto", options);
        const packageObject = grpc.loadPackageDefinition(packageDefinition);
        const controller = packageObject.commandable.Commandable.service;
        this.registerController(controller, {
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
            const method = call.request.method;
            const action = this._commandableMethods ? this._commandableMethods[method] : null;
            const traceId = call.request.trace_id;
            // Handle method not found
            if (action == null) {
                const err = new pip_services4_commons_node_3.InvocationException(traceId, "METHOD_NOT_FOUND", "Method " + method + " was not found").withDetails("method", method);
                const response = {
                    error: pip_services4_commons_node_1.ErrorDescriptionFactory.create(err),
                    result_empty: true,
                    result_json: null
                };
                return response;
            }
            return yield action(call);
        });
    }
    /**
     * Registers a controller with related implementation
     *
     * @param controller        a GRPC controller object.
     * @param implementation the controller implementation methods.
     */
    registerController(controller, implementation) {
        this._server.addService(controller, implementation);
    }
    /**
     * Registers a commandable method in this objects GRPC server (controller) by the given name.,
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
GrpcEndpoint._defaultConfig = pip_services4_components_node_1.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "0.0.0.0", "connection.port", 3000, "credential.ssl_key_file", null, "credential.ssl_crt_file", null, "credential.ssl_ca_file", null, "options.maintenance_enabled", false, "options.request_max_size", 1024 * 1024, "options.file_max_size", 200 * 1024 * 1024, "options.connect_timeout", 60000, "options.debug", true);
//# sourceMappingURL=GrpcEndpoint.js.map