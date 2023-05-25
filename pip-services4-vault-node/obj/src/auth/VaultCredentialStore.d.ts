/** @module auth */
import { ConfigParams, IConfigurable, IOpenable, IReferenceable, IReferences } from 'pip-services4-commons-node';
import { IReconfigurable } from 'pip-services4-commons-node';
import { CompositeLogger, CredentialParams } from 'pip-services4-components-node';
import { ICredentialStore } from 'pip-services4-components-node';
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
export declare class VaultCredentialStore implements ICredentialStore, IReconfigurable, IReferenceable, IConfigurable, IOpenable {
    private _connectionResolver;
    private _credentialResolver;
    private _proxy_enable;
    private _proxy_port;
    private _proxy_host;
    private _auth_type;
    private _file_cert;
    private _file_key;
    private _file_cacert;
    private _timeout;
    private _root_path;
    private _namespace;
    private _client;
    private _token;
    /**
     * The logger.
     */
    protected _logger: CompositeLogger;
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
    * Sets references to dependent components.
    *
    * @param references 	references to locate the component dependencies.
    */
    setReferences(references: IReferences): void;
    /**
         * Checks if the component is opened.
         *
         * @returns true if the component has been opened and false otherwise.
         */
    isOpen(): boolean;
    /**
     *  Helper method for resolve all additonal parameters
     */
    private resolveConfig;
    /**
     *  Helper method for compose uri
     */
    private composeUri;
    /**
    * Reads connections from configuration parameters.
    * And save it to Vault.
    *
    * @param config   configuration parameters to be read
    * @param rewrite   rewrite flag if key exists
    */
    loadVaultCredentials(config: ConfigParams, rewrite?: boolean): Promise<void>;
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context: IContext): Promise<void>;
    /**
    * Closes component and frees used resources.
    *
    * @param context 	(optional) execution context to trace execution through call chain.
    */
    close(context: IContext): Promise<void>;
    /**
     * Stores credential parameters into the store.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the credential parameters.
     * @param credential        a credential parameters to be stored.
     */
    store(context: IContext, key: string, credential: CredentialParams): Promise<void>;
    /**
     * Lookups credential parameters by its key.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the credential parameters.
     * @param callback          callback function that receives found credential parameters or error.
     */
    lookup(context: IContext, key: string): Promise<CredentialParams>;
}
