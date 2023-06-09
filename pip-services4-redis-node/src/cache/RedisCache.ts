/** @module cache */

import { ConfigException, InvalidStateException } from "pip-services4-commons-node";
import { IConfigurable, IReferenceable, IOpenable, ConfigParams, IReferences, IContext, ContextResolver } from "pip-services4-components-node";
import { ConnectionResolver, CredentialResolver } from "pip-services4-config-node";
import { ICache } from "pip-services4-logic-node";

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
export class RedisCache implements ICache, IConfigurable, IReferenceable, IOpenable {
    private _connectionResolver: ConnectionResolver = new ConnectionResolver();
    private _credentialResolver: CredentialResolver = new CredentialResolver();

    private _timeout = 30000;
    private _retries = 3;

    private _client: any = null;

    /**
     * Creates a new instance of this cache.
     */
    public constructor() {
        //
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
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
    public setReferences(references: IReferences): void {
        this._connectionResolver.setReferences(references);
        this._credentialResolver.setReferences(references);
    }

    /**
     * Checks if the component is opened.
     * 
     * @returns true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._client != null;
    }

    /**
     * Opens the component.
     * 
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        const connection = await this._connectionResolver.resolve(context);
        if (connection == null) {
            throw new ConfigException(
                context != null ? ContextResolver.getTraceId(context) : null,
                'NO_CONNECTION',
                'Connection is not configured'
            );
        }

        const credential = await this._credentialResolver.lookup(context);

        const options: any = {
            // connect_timeout: this._timeout,
            // max_attempts: this._retries,
            retry_strategy: (options) => { return this.retryStrategy(options); }
        };

        if (connection.getUri() != null) {
            options.url = connection.getUri();
        } else {
            options.host = connection.getHost() || 'localhost';
            options.port = connection.getPort() || 6379;
        }

        if (credential != null) {
            options.password = credential.getPassword();
        }

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const redis = require('redis');
        this._client = redis.createClient(options);
    }

    /**
     * Closes component and frees used resources.
     * 
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async close(context: IContext): Promise<void> {
        if (this._client == null) return;

        await new Promise<void>((resolve, reject) => {
            this._client.quit((err) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });

        this._client = null;
    }

    private checkOpened(context: IContext): void {
        if (!this.isOpen()) {
            throw new InvalidStateException(
                context != null ? ContextResolver.getTraceId(context) : null,
                'NOT_OPENED',
                'Connection is not opened'
            );
        }
    }

    private retryStrategy(options: any): any {
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
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique value key.
     * @returns a retrieve cached value or <code>null</code> if nothing was found.
     */
    public async retrieve(context: IContext, key: string): Promise<any> {
        this.checkOpened(context);

        return await new Promise<any>((resolve, reject) => {
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
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique value key.
     * @param value             a value to store.
     * @param timeout           expiration timeout in milliseconds.
     * @returns the stored value.
     */
    public async store(context: IContext, key: string, value: any, timeout: number): Promise<any> {
        this.checkOpened(context);

        return await new Promise<any>((resolve, reject) => {
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
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique value key.
     * @returns the removed value.
     */
    public async remove(context: IContext, key: string): Promise<any> {
        this.checkOpened(context);

        return await new Promise<any>((resolve, reject) => {
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