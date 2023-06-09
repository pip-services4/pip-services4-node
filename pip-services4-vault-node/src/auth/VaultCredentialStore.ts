/** @module auth */

import { ICredentialStore, ConnectionResolver, CredentialResolver, ConnectionParams, CredentialParams } from "pip-services4-config-node";
import { ConfigException, ApplicationException, ConnectionException } from "pip-services4-commons-node";
import { IReconfigurable, IReferenceable, IConfigurable, IOpenable, ConfigParams, IReferences, IContext, ContextResolver } from "pip-services4-components-node";
import { CompositeLogger } from "pip-services4-observability-node";


/**
 * Credential store that keeps credentials in memory.
 * 
 * ### Configuration parameters ###
 * 
 * - connection(s):           
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 *   - proxy_enable:          enable proxy (default false)
 *   - proxy_host:            proxy host name
 *   - proxy_port:            proxy port number
 * - credential(s):
 *   - store_key:             key to retrieve parameters from credential store
 *   - username:              set user name for ldap and userpass auth type, role_id for approle and k8s auth type, cert_name for cert auth type
 *   - password:              user password for ldap and userpass auth type, secret_id for approle auth type, token for k8s and cert_name auth type
 *   - auth_type:             auth type (approle, ldap, userpass, k8s, cert) default - userpass
 *   - file_cert:             client certificate file for https mode
 *   - file_key:              client key file for https mode
 *   - file_cacert:           root CA cert path for https mode
 * - options:
 *   - root_path:             root path after the base URL
 *   - timeout:               default timeout in milliseconds (default: 5 sec)
 *   - namespace:             namespace (multi-tenancy) feature available on all Vault Enterprise versions    
 *  
 * @see [[ICredentialStore]]
 * @see [[CredentialParams]]
 * 
 * ### Example ###
 * 
 *     
 *     let credentialStore = new VaultCredentialStore();
 *     credentialStore.open();
 *     
 *     let credential = await credentialStore.lookup("123", "key1");
 *     // Result: user=jdoe; pass=pass123
 */
export class VaultCredentialStore implements ICredentialStore, IReconfigurable, IReferenceable, IConfigurable, IOpenable {
    private _connectionResolver: ConnectionResolver = new ConnectionResolver();
    private _credentialResolver: CredentialResolver = new CredentialResolver();

    //connection params
    private _proxy_enable = false;
    private _proxy_port: number;
    private _proxy_host: string;

    // credentials
    private _auth_type = "userpass"
    private _file_cert: string;
    private _file_key: string;
    private _file_cacert: string;

    // options
    private _timeout = 5000;
    private _root_path: string;
    private _namespace: string;

    private _client: any = null;
    private _token: string;

    /** 
     * The logger.
     */
    protected _logger: CompositeLogger = new CompositeLogger();

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this._connectionResolver.configure(config);
        this._credentialResolver.configure(config);
        this._logger.configure(config);

        this._timeout = config.getAsIntegerWithDefault('options.timeout', this._timeout);
        this._root_path = config.getAsStringWithDefault('options.root_path', this._root_path);
        this._namespace = config.getAsStringWithDefault('options.namespace', this._namespace);
    }

    /**
    * Sets references to dependent components.
    * 
    * @param references 	references to locate the component dependencies. 
    */
    public setReferences(references: IReferences): void {
        this._connectionResolver.setReferences(references);
        this._credentialResolver.setReferences(references);
        this._logger.setReferences(references);
    }
    /**
         * Checks if the component is opened.
         * 
         * @returns true if the component has been opened and false otherwise.
         */
    public isOpen(): boolean {
        return this._client;
    }

    /**
     *  Helper method for resolve all additonal parameters
     */
    private resolveConfig(context: IContext, connection: ConnectionParams, credential: CredentialParams) {

        // check configuration
        if (connection == null) {
            throw new ConfigException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "NO_CONNECTION",
                "Connection is not configured"
            );
        }

        if (credential == null) {
            throw new ConfigException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "NO_CREDENTIAL",
                "Credentials is not configured"
            );
        }

        // resolve additional credential params
        this._auth_type = credential.getAsStringWithDefault("auth_type", "userpass");
        this._file_cert = credential.getAsNullableString("file_cert");
        this._file_key = credential.getAsNullableString("file_key");
        this._file_cacert = credential.getAsNullableString("file_cacert");

        // resolve additionla connection params
        this._proxy_enable = connection.getAsBooleanWithDefault("proxy_enable", false);
        this._proxy_port = connection.getAsNullableInteger("proxy_port");
        this._proxy_host = connection.getAsNullableString("proxy_host");

    }

    /**
     *  Helper method for compose uri
     */
    private composeUri(context: IContext, connection: ConnectionParams): string {

        if (connection.getUri() != null) {
            const uri = connection.getUri();
            if (uri) return uri;
        }

        const host = connection.getHost();
        if (host == null) {
            throw new ConfigException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "NO_HOST",
                "Connection host is not set"
            );
        }

        const port = connection.getPort();
        if (port == 0) {
            throw new ConfigException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "NO_PORT",
                "Connection port is not set"
            );
        }

        const protocol = connection.getProtocol();
        if (protocol == null) {
            throw new ConfigException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "NO_PROTOCOL",
                "Connection protocol is not set"
            );
        }

        return protocol + '://' + host + ':' + port + '/v1';
    }

    /**
    * Reads connections from configuration parameters.
    * And save it to Vault.
    * 
    * @param config   configuration parameters to be read
    * @param rewrite   rewrite flag if key exists
    */
    public async loadVaultCredentials(config: ConfigParams, rewrite?: boolean): Promise<void> {
        const items: Map<string, CredentialParams> = new Map();

        if (config.length() > 0) {
            const connectionSections: string[] = config.getSectionNames();
            for (let index = 0; index < connectionSections.length; index++) {
                const key = connectionSections[index]
                const value: ConfigParams = config.getSection(key);

                items.set(key, new CredentialParams(value));
            }
        }

        // Register all credentials in vault
        for (const key of items.keys()) {
            if (!rewrite) {
                try {
                    await this._client.readKVSecret(this._token, key);
                } catch (ex) {
                    if (ex.response && ex.response.status == 404) {
                        await this.store(null, key, items.get(key));
                    } else {
                        throw ex;
                    }
                }
            } else {
                await this.store(null, key, items.get(key));
            }
        }
    }

    /**
     * Opens the component.
     * 
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {

        const connection = await this._connectionResolver.resolve(context);
        const credential = await this._credentialResolver.lookup(context);
        this.resolveConfig(context, connection, credential);

        const options: any =
        {
            https: connection.getProtocol() === "https",
            baseUrl: this.composeUri(context, connection),
            timeout: this._timeout,
            proxy: false,
        };

        // configure additional options
        if (this._root_path != null) {
            options.rootPath = this._root_path;
        }

        if (this._namespace != null) {
            options.namespace = this._namespace;
        }

        // configure https connection
        if (connection.getProtocol() === "https") {
            options.cert = this._file_cert;
            options.key = this._file_key;
            options.cacert = this._file_cacert;
        }

        // configure proxy
        if (this._proxy_enable) {
            options.proxy = {
                host: this._proxy_host,
                port: this._proxy_port
            }
        }

        // configure credentials
        let username: string;
        let password: string;

        if (credential != null) {
            username = credential.getUsername();
            password = credential.getPassword();
        }

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Vault = require('hashi-vault-js');
        this._client = new Vault(options);
        const status = await this._client.healthCheck();

        // resolve status
        if (status.isVaultError || status.response) {
            const err = new ApplicationException("ERROR", context != null ? ContextResolver.getTraceId(context) : null, "OPEN_ERROR", status.vaultHelpMessage);
            this._logger.error(context, err, status.vaultHelpMessage, status.response)
            this._client = null;
            throw err;
        } else if (status.sealed) {
            const err = new ApplicationException("ERROR", context != null ? ContextResolver.getTraceId(context) : null, "OPEN_ERROR", "Vault server is sealed!")
            this._logger.error(context, err, "Vault server is sealed!")
            this._client = null;
            throw err // TODO: Decide, does need to throw error?
        }

        this._logger.debug(context, "Vault status:", status)

        // open connection and get API token
        try {
            switch (this._auth_type) {
                case "approle": {
                    this._token = (await this._client.loginWithAppRole(username, password)).client_token;
                    break;
                }
                case "ldap": {
                    this._token = (await this._client.loginWithLdap(username, password)).client_token;
                    break;
                }
                case "userpass": {
                    this._token = (await this._client.loginWithUserpass(username, password)).client_token;
                    break;
                }
                case "k8s": {
                    this._token = (await this._client.loginWithK8s(username, password)).client_token;
                    break;
                }
                case "cert": {
                    this._token = (await this._client.loginWithCert(username, password)).client_token;
                    break;
                }
                default: {
                    this._token = (await this._client.loginWithUserpass(username, password)).client_token;
                    break;
                }
            }
        } catch (ex) {
            const err = new ConnectionException(context != null ? ContextResolver.getTraceId(context) : null, "LOGIN_ERROR", "Can't login to Vault server").withCause(ex);
            this._logger.error(context, ex, "Can't login to Vault server")
            this._client = null;
            throw err
        }
        this._logger.info(context, "Vault Credential Store opened with %s auth mode", this._auth_type);
        return
    }

    /**
    * Closes component and frees used resources.
    * 
    * @param context 	(optional) execution context to trace execution through call chain.
    */
    public async close(context: IContext): Promise<void> {
        if (this.isOpen()) {
            this._client = null;
        }
        this._logger.info(context, "Vault Credential Store closed");
    }

    /**
     * Stores credential parameters into the store.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the credential parameters.
     * @param credential        a credential parameters to be stored.
     */
    public async store(context: IContext, key: string, credential: CredentialParams): Promise<void> {
        if (this.isOpen()) {
            
            try {
                const credentials = [credential.getAsObject()];
                let version = 0;
                try {
                    const res = await this._client.readKVSecret(this._token, key);
                    version = res.metadata.version;
                    if (res.data.credentials) {
                        // Check if connection already exists
                        for (const conn of res.data.credentials) {
                            if (credential.getUsername() == (conn.username ?? conn.user) && credential.getPassword() == (conn.password ?? conn.pass)) {
                                this._logger.info(context, 'Credential already exists via key ' + key + ': ' + credential);
                                return;
                            }
                        }
                    }
                } catch (ex) {
                    if (ex.response && ex.response.status == 404) {
                        // pass
                    } else {
                        throw ex;
                    }
                }

                if (version > 0) {
                    await this._client.updateKVSecret(this._token, key, { credentials: credentials }, version);
                } else {
                    await this._client.createKVSecret(this._token, key, { credentials: credentials });
                }

                this._logger.debug(context, 'Stored key ' + key + ': ' + credential);
                return;
            } catch (ex) {
                this._logger.error(context, ex, "Can't store KV to Vault with key: " + key);
            }

        }
    }

    /**
     * Lookups credential parameters by its key.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the credential parameters.
     * @param callback          callback function that receives found credential parameters or error.
     */
    public async lookup(context: IContext, key: string): Promise<CredentialParams> {
        if (this.isOpen()) {
            try {
                const res = await this._client.readKVSecret(this._token, key);
                let credential: CredentialParams;
                if (res.data && res.data.credentials && res.data.credentials.length > 0)
                    credential = new CredentialParams(res.data.credentials[0]);

                this._logger.debug(context, 'KVs for ' + key + ': ', credential);

                return credential;
            } catch (ex) {
                this._logger.error(context, ex, "Can't lookup KV from Vault with key: " + key);
            }
        }
    }
}