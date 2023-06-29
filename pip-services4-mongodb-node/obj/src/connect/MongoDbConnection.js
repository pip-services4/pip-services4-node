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
exports.MongoDbConnection = void 0;
/** @module connect */
const mongodb_1 = require("mongodb");
const MongoDbConnectionResolver_1 = require("./MongoDbConnectionResolver");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
/**
 * MongoDB connection using plain driver.
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
 *   - username:                  (optional) user name
 *   - password:                  (optional) user password
 * - options:
 *   - max_pool_size:             (optional) maximum connection pool size (default: 2)
 *   - keep_alive:                (optional) enable connection keep alive (default: true)
 *   - connect_timeout:           (optional) connection timeout in milliseconds (default: 5000)
 *   - socket_timeout:            (optional) socket timeout in milliseconds (default: 360000)
 *   - auto_reconnect:            (optional) enable auto reconnection (default: true)
 *   - reconnect_interval:        (optional) reconnection interval in milliseconds (default: 1000)
 *   - max_page_size:             (optional) maximum page size (default: 100)
 *   - replica_set:               (optional) name of replica set
 *   - ssl:                       (optional) enable SSL connection (default: false)
 *   - auth_source:               (optional) authentication source
 *   - debug:                     (optional) enable debug output (default: false).
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credentials
 *
 */
class MongoDbConnection {
    /**
     * Creates a new instance of the connection component.
     */
    constructor() {
        this._defaultConfig = pip_services4_components_node_1.ConfigParams.fromTuples(
        // connections.*
        // credential.*
        "options.max_pool_size", 2, "options.keep_alive", 1, "options.connect_timeout", 5000, "options.auto_reconnect", true, "options.max_page_size", 100, "options.debug", true);
        /**
         * The logger.
         */
        this._logger = new pip_services4_observability_node_1.CompositeLogger();
        /**
         * The connection resolver.
         */
        this._connectionResolver = new MongoDbConnectionResolver_1.MongoDbConnectionResolver();
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
    composeSettings() {
        const maxPoolSize = this._options.getAsNullableInteger("max_pool_size");
        const keepAlive = this._options.getAsNullableInteger("keep_alive");
        const connectTimeoutMS = this._options.getAsNullableInteger("connect_timeout");
        const socketTimeoutMS = this._options.getAsNullableInteger("socket_timeout");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const autoReconnect = this._options.getAsNullableBoolean("auto_reconnect");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const reconnectInterval = this._options.getAsNullableInteger("reconnect_interval");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const debug = this._options.getAsNullableBoolean("debug");
        const ssl = this._options.getAsNullableBoolean("ssl");
        const replicaSet = this._options.getAsNullableString("replica_set");
        const authSource = this._options.getAsNullableString("auth_source");
        const authUser = this._options.getAsNullableString("auth_user");
        const authPassword = this._options.getAsNullableString("auth_password");
        const settings = {
            maxPoolSize: maxPoolSize,
            keepAliveInitialDelay: keepAlive,
            //autoReconnect: autoReconnect,
            // reconnectInterval: reconnectInterval,
            connectTimeoutMS: connectTimeoutMS,
            socketTimeoutMS: socketTimeoutMS,
            // ssl: ssl,
            // replicaSet: replicaSet,
            // authSource: authSource,
            // 'auth.user': authUser,
            // 'auth.password': authPassword
            // authSource: this._databaseName
        };
        if (ssl != null)
            settings.ssl = ssl;
        if (replicaSet != null)
            settings.replicaSet = replicaSet;
        if (authSource != null)
            settings.authSource = authSource;
        if (authUser != null)
            settings['auth.user'] = authUser;
        if (authPassword != null)
            settings['auth.password'] = authPassword;
        return settings;
    }
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = yield this._connectionResolver.resolve(context);
            this._logger.debug(context, "Connecting to mongodb");
            try {
                const settings = this.composeSettings();
                const client = yield new mongodb_1.MongoClient(uri, settings).connect();
                this._connection = client;
                this._db = client.db();
                this._databaseName = this._db.databaseName;
            }
            catch (ex) {
                throw new pip_services4_commons_node_1.ConnectionException(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, "CONNECT_FAILED", "Connection to mongodb failed").withCause(ex);
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
            yield this._connection.close();
            this._connection = null;
            this._db = null;
            this._databaseName = null;
            this._logger.debug(context, "Disconnected from mongodb database %s", this._databaseName);
        });
    }
    getConnection() {
        return this._connection;
    }
    getDatabase() {
        return this._db;
    }
    getDatabaseName() {
        return this._databaseName;
    }
}
exports.MongoDbConnection = MongoDbConnection;
//# sourceMappingURL=MongoDbConnection.js.map