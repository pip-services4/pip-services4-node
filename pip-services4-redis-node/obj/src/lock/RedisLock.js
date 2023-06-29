"use strict";
/** @module lock */
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
exports.RedisLock = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_config_node_1 = require("pip-services4-config-node");
const pip_services4_logic_node_1 = require("pip-services4-logic-node");
const pip_services4_data_node_1 = require("pip-services4-data-node");
/**
 * Distributed lock that is implemented based on Redis in-memory database.
 *
 * ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 * - credential(s):
 *   - store_key:             key to retrieve parameters from credential store
 *   - username:              user name (currently is not used)
 *   - password:              user password
 * - options:
 *   - retry_timeout:         timeout in milliseconds to retry lock acquisition. (Default: 100)
 *   - retries:               number of retries (default: 3)
 *
 * ### References ###
 *
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credential
 *
 * ### Example ###
 *
 *     let lock = new RedisRedis();
 *     lock.configure(ConfigParams.fromTuples(
 *       "host", "localhost",
 *       "port", 6379
 *     ));
 *
 *     lock.open("123");
 *
 *     await lock.acquire("123", "key1");
 *     try {
 *       // Processing...
 *     } finally {
 *       await lock.releaseLock("123", "key1");
 *     }
 */
class RedisLock extends pip_services4_logic_node_1.Lock {
    constructor() {
        super(...arguments);
        this._connectionResolver = new pip_services4_config_node_1.ConnectionResolver();
        this._credentialResolver = new pip_services4_config_node_1.CredentialResolver();
        this._lock = pip_services4_data_node_1.IdGenerator.nextLong();
        this._timeout = 30000;
        this._retries = 3;
        this._client = null;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._connectionResolver.configure(config);
        this._credentialResolver.configure(config);
        this._timeout = config.getAsIntegerWithDefault('options.timeout', this._timeout);
        this._retries = config.getAsIntegerWithDefault('options.retries', this._retries);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._connectionResolver.setReferences(references);
        this._credentialResolver.setReferences(references);
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._client != null;
    }
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this._connectionResolver.resolve(context);
            if (connection == null) {
                throw new pip_services4_commons_node_1.ConfigException(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, 'NO_CONNECTION', 'Connection is not configured');
            }
            const credential = yield this._credentialResolver.lookup(context);
            const options = {
                // connect_timeout: this._timeout,
                // max_attempts: this._retries,
                retry_strategy: (options) => { return this.retryStrategy(options); }
            };
            if (connection.getUri() != null) {
                options.url = connection.getUri();
            }
            else {
                options.host = connection.getHost() || 'localhost';
                options.port = connection.getPort() || 6379;
            }
            if (credential != null) {
                options.password = credential.getPassword();
            }
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const redis = require('redis');
            this._client = redis.createClient(options);
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    close(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._client == null)
                return;
            yield new Promise((resolve, reject) => {
                this._client.quit((err) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
            this._client = null;
        });
    }
    checkOpened(context) {
        if (!this.isOpen()) {
            throw new pip_services4_commons_node_1.InvalidStateException(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, 'NOT_OPENED', 'Connection is not opened');
        }
    }
    retryStrategy(options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > this._timeout) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.attempt > this._retries) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
    /**
     * Makes a single attempt to acquire a lock by its key.
     * It returns immediately a positive or negative result.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique lock key to acquire.
     * @param ttl               a lock timeout (time to live) in milliseconds.
     * @returns <code>true</code> if lock was successfully acquired and <code>false</code> otherwise.
     */
    tryAcquireLock(context, key, ttl) {
        this.checkOpened(context);
        return new Promise((resolve, reject) => {
            this._client.set(key, this._lock, 'NX', 'PX', ttl, (err, result) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve(result == "OK");
            });
        });
    }
    /**
     * Releases prevously acquired lock by its key.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique lock key to release.
     */
    releaseLock(context, key) {
        this.checkOpened(context);
        return new Promise((resolve, reject) => {
            // Start transaction on key
            this._client.watch(key, (err) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                // Read and check if lock is the same
                this._client.get(key, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    // Remove the lock if it matches
                    if (result == this._lock) {
                        this._client.multi()
                            .del(key)
                            .exec((err) => {
                            if (err != null)
                                reject(err);
                            else
                                resolve();
                        });
                    }
                    // Cancel transaction if it doesn't match
                    else {
                        this._client.unwatch((err) => {
                            if (err != null)
                                reject(err);
                            else
                                resolve();
                        });
                    }
                });
            });
        });
    }
}
exports.RedisLock = RedisLock;
//# sourceMappingURL=RedisLock.js.map