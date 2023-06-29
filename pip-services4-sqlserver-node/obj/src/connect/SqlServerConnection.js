"use strict";
/** @module persistence */
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
exports.SqlServerConnection = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const SqlServerConnectionResolver_1 = require("../connect/SqlServerConnectionResolver");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
/**
 * SQLServer connection using plain driver.
 *
 * By defining a connection and sharing it through multiple persistence components
 * you can reduce number of used database connections.
 *
 * ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:             (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - host:                      host name or IP address
 *   - port:                      port number (default: 27017)
 *   - uri:                       resource URI or connection string with all parameters in it
 * - credential(s):
 *   - store_key:                 (optional) a key to retrieve the credentials from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/auth.icredentialstore.html ICredentialStore]]
 *   - username:                  user name
 *   - password:                  user password
 * - options:
 *   - connect_timeout:      (optional) number of milliseconds to wait before timing out when connecting a new client (default: 0)
 *   - idle_timeout:         (optional) number of milliseconds a client must sit idle in the pool and not be checked out (default: 10000)
 *   - max_pool_size:        (optional) maximum number of clients the pool should contain (default: 10)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credentials
 *
 */
class SqlServerConnection {
    /**
     * Creates a new instance of the connection component.
     */
    constructor() {
        this._defaultConfig = pip_services4_components_node_1.ConfigParams.fromTuples(
        // connections.*
        // credential.*
        "options.connect_timeout", 15000, "options.request_timeout", 15000, "options.idle_timeout", 30000, "options.max_pool_size", 3);
        /**
         * The logger.
         */
        this._logger = new pip_services4_observability_node_1.CompositeLogger();
        /**
         * The connection resolver.
         */
        this._connectionResolver = new SqlServerConnectionResolver_1.SqlServerConnectionResolver();
        /**
         * The configuration options.
         */
        this._options = new pip_services4_components_node_1.ConfigParams();
        //
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        config = config.setDefaults(this._defaultConfig);
        this._connectionResolver.configure(config);
        this._options = this._options.override(config.getSection("options"));
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
        this._connectionResolver.setReferences(references);
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._connection != null;
    }
    composeUriSettings(uri) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const maxPoolSize = this._options.getAsNullableInteger("max_pool_size");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const connectTimeoutMS = this._options.getAsNullableInteger("connect_timeout");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const requestTimeoutMS = this._options.getAsNullableInteger("request_timeout");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const idleTimeoutMS = this._options.getAsNullableInteger("idle_timeout");
        const settings = {
        // parseJSON: true,
        // connectTimeout: connectTimeoutMS,
        // requestTimeout: requestTimeoutMS,
        // 'pool.min': 0,
        // 'pool.max': maxPoolSize,
        // 'pool.idleTimeoutMillis': idleTimeoutMS
        };
        let params = '';
        for (const key in settings) {
            if (params.length > 0) {
                params += '&';
            }
            params += key;
            const value = settings[key];
            if (value != null) {
                params += '=' + value;
            }
        }
        if (uri.indexOf('?') < 0) {
            uri += '?' + params;
        }
        else {
            uri += '&' + params;
        }
        return uri;
    }
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let uri = yield this._connectionResolver.resolve(context);
            this._logger.debug(context, "Connecting to SQLServer...");
            try {
                uri = this.composeUriSettings(uri);
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const sql = require('mssql');
                const pool = new sql.ConnectionPool(uri);
                pool.config.options.enableArithAbort = true;
                // Try to connect
                yield new Promise((resolve, reject) => {
                    pool.connect((err) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                });
                this._logger.info(context, "Connected to SQLServer database %s", this._databaseName);
                this._connection = pool;
                this._databaseName = pool.config.database;
            }
            catch (ex) {
                throw new pip_services4_commons_node_1.ConnectionException(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, "CONNECT_FAILED", "Connection to SQLServer failed").withCause(ex);
            }
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    close(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._connection == null) {
                return;
            }
            try {
                yield new Promise((resolve, reject) => {
                    this._connection.close((err) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                });
                this._logger.info(context, "Disconnected from SQLServer database %s", this._databaseName);
                this._connection = null;
                this._databaseName = null;
            }
            catch (ex) {
                throw new pip_services4_commons_node_1.ConnectionException(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, 'DISCONNECT_FAILED', 'Disconnect from sqlserver failed: ').withCause(ex);
            }
        });
    }
    getConnection() {
        return this._connection;
    }
    getDatabaseName() {
        return this._databaseName;
    }
}
exports.SqlServerConnection = SqlServerConnection;
//# sourceMappingURL=SqlServerConnection.js.map