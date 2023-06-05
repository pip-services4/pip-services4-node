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
exports.CouchbaseConnection = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const CouchbaseConnectionResolver_1 = require("../connect/CouchbaseConnectionResolver");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
/**
 * Couchbase connection using plain couchbase driver.
 *
 * This is the most basic persistence component that is only
 * able to store data items of any type. Specific CRUD operations
 * over the data items must be implemented in child classes by
 * accessing <code>this._collection</code> or <code>this._model</code> properties.
 *
 * ### Configuration parameters ###
 *
 * - bucket:                      (optional) Couchbase bucket name
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
 *   - auto_create:               (optional) automatically create missing bucket (default: false)
 *   - auto_index:                (optional) automatically create primary index (default: false)
 *   - flush_enabled:             (optional) bucket flush enabled (default: false)
 *   - bucket_type:               (optional) bucket type (default: couchbase)
 *   - ram_quota:                 (optional) RAM quota in MB (default: 100)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credentials
 */
class CouchbaseConnection {
    /**
     * Creates a new instance of the connection component.
     *
     * @param bucketName the name of couchbase bucket
     */
    constructor(bucketName) {
        this._defaultConfig = pip_services4_components_node_1.ConfigParams.fromTuples("bucket", null, 
        // connections.*
        // credential.*
        "options.auto_create", false, "options.auto_index", true, "options.flush_enabled", true, "options.bucket_type", "couchbase", "options.ram_quota", 100);
        /**
         * The logger.
         */
        this._logger = new pip_services4_observability_node_1.CompositeLogger();
        /**
         * The connection resolver.
         */
        this._connectionResolver = new CouchbaseConnectionResolver_1.CouchbaseConnectionResolver();
        /**
         * The configuration options.
         */
        this._options = new pip_services4_components_node_1.ConfigParams();
        this._bucketName = bucketName;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        config = config.setDefaults(this._defaultConfig);
        this._connectionResolver.configure(config);
        this._bucketName = config.getAsStringWithDefault('bucket', this._bucketName);
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
        // return this._connection.readyState == 1;
        return this._connection != null;
    }
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this._connectionResolver.resolve(context);
            this._logger.debug(context, "Connecting to couchbase");
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const couchbase = require('couchbase');
                this._connection = new couchbase.Cluster(connection.uri);
                if (connection.username) {
                    this._connection.authenticate(connection.username, connection.password);
                }
                let newBucket = false;
                const autocreate = this._options.getAsBoolean('auto_create');
                if (autocreate) {
                    const options = {
                        bucketType: this._options.getAsStringWithDefault('bucket_type', 'couchbase'),
                        ramQuotaMB: this._options.getAsLongWithDefault('ram_quota', 100),
                        flushEnabled: this._options.getAsBooleanWithDefault('flush_enabled', true) ? 1 : 0
                    };
                    yield new Promise((resolve, reject) => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        this._connection.manager().createBucket(this._bucketName, options, (err, result) => {
                            if (err && err.message && err.message.indexOf('name already exist') > 0) {
                                err = null;
                            }
                            if (err != null) {
                                reject(err);
                                return;
                            }
                            resolve();
                        });
                    });
                    newBucket = true;
                    // Delay to allow couchbase to initialize the bucket
                    // Otherwise opening will fail
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    yield new Promise((resolve, reject) => { setTimeout(resolve, 2000); });
                }
                this._bucket = yield new Promise((resolve, reject) => {
                    const bucket = this._connection.openBucket(this._bucketName, (err) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }
                        resolve(bucket);
                    });
                });
                this._logger.debug(context, "Connected to couchbase bucket %s", this._bucketName);
                const autoIndex = this._options.getAsBoolean('auto_index');
                if (newBucket || autoIndex) {
                    yield new Promise((resolve, reject) => {
                        this._bucket.manager().createPrimaryIndex({ ignoreIfExists: 1 }, (err) => {
                            if (err != null) {
                                reject(err);
                                return;
                            }
                            resolve();
                        });
                    });
                }
            }
            catch (ex) {
                this._connection = null;
                this._bucket = null;
                throw new pip_services4_commons_node_1.ConnectionException(context != null ? context.getTraceId() : null, "CONNECT_FAILED", "Connection to couchbase failed").withCause(ex);
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
            if (this._bucket) {
                this._bucket.disconnect();
            }
            this._connection = null;
            this._bucket = null;
            this._logger.debug(context, "Disconnected from couchbase bucket %s", this._bucketName);
        });
    }
    getConnection() {
        return this._connection;
    }
    getBucket() {
        return this._bucket;
    }
    getBucketName() {
        return this._bucketName;
    }
}
exports.CouchbaseConnection = CouchbaseConnection;
//# sourceMappingURL=CouchbaseConnection.js.map