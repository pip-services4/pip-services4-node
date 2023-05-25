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
exports.RedisCache = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const pip_services3_components_node_1 = require("pip-services4-components-node");
const pip_services3_components_node_2 = require("pip-services4-components-node");
/**
 * Distributed cache that stores values in Redis in-memory database.
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
 *   - retries:               number of retries (default: 3)
 *   - timeout:               default caching timeout in milliseconds (default: 1 minute)
 *   - max_size:              maximum number of values stored in this cache (default: 1000)
 *
 * ### References ###
 *
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credential
 *
 * ### Example ###
 *
 *     let cache = new RedisCache();
 *     cache.configure(ConfigParams.fromTuples(
 *       "host", "localhost",
 *       "port", 6379
 *     ));
 *
 *     await cache.open("123");
 *
 *     await cache.store("123", "key1", "ABC");
 *     let value = await cache.store("123", "key1"); // Result: "ABC"
 */
class RedisCache {
    /**
     * Creates a new instance of this cache.
     */
    constructor() {
        this._connectionResolver = new pip_services3_components_node_1.ConnectionResolver();
        this._credentialResolver = new pip_services3_components_node_2.CredentialResolver();
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
            let connection = yield this._connectionResolver.resolve(context);
            if (connection == null) {
                throw new pip_services3_commons_node_2.ConfigException(context, 'NO_CONNECTION', 'Connection is not configured');
            }
            let credential = yield this._credentialResolver.lookup(context);
            let options = {
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
            let redis = require('redis');
            this._client = redis.createClient(options);
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
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
            throw new pip_services3_commons_node_1.InvalidStateException(context, 'NOT_OPENED', 'Connection is not opened');
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
     * Retrieves cached value from the cache using its key.
     * If value is missing in the cache or expired it returns null.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param key               a unique value key.
     * @returns a retrieve cached value or <code>null</code> if nothing was found.
     */
    retrieve(context, key) {
        this.checkOpened(context);
        return new Promise((resolve, reject) => {
            this._client.get(key, (err, value) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve(value ? JSON.parse(value) : value);
            });
        });
    }
    /**
     * Stores value in the cache with expiration time.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param key               a unique value key.
     * @param value             a value to store.
     * @param timeout           expiration timeout in milliseconds.
     * @returns the stored value.
     */
    store(context, key, value, timeout) {
        this.checkOpened(context);
        return new Promise((resolve, reject) => {
            this._client.set(key, JSON.stringify(value), 'PX', timeout, (err, value) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve(value);
            });
        });
    }
    /**
     * Removes a value from the cache by its key.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param key               a unique value key.
     * @returns the removed value.
     */
    remove(context, key) {
        this.checkOpened(context);
        return new Promise((resolve, reject) => {
            this._client.del(key, (err, value) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve(value ? JSON.parse(value) : value);
            });
        });
    }
}
exports.RedisCache = RedisCache;
//# sourceMappingURL=RedisCache.js.map