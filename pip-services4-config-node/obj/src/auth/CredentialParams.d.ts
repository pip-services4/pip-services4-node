/** @module auth */
import { ConfigParams } from 'pip-services4-components-node';
/**
 * Contains credentials to authenticate against external services.
 * They are used together with connection parameters, but usually stored
 * in a separate store, protected from unauthorized access.
 *
 * ### Configuration parameters ###
 *
 * - store_key:     key to retrieve parameters from credential store
 * - username:      user name
 * - user:          alternative to username
 * - password:      user password
 * - pass:          alternative to password
 * - access_id:     application access id
 * - client_id:     alternative to access_id
 * - access_key:    application secret key
 * - client_key:    alternative to access_key
 * - secret_key:    alternative to access_key
 *
 * In addition to standard parameters CredentialParams may contain any number of custom parameters
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-commons-node/classes/config.configparams.html ConfigParams]]
 * @see [[ConnectionParams]]
 * @see [[CredentialResolver]]
 * @see [[ICredentialStore]]
 *
 * ### Example ###
 *
 *     let credential = CredentialParams.fromTuples(
 *         "user", "jdoe",
 *         "pass", "pass123",
 *         "pin", "321"
 *     );
 *
 *     let username = credential.getUsername();             // Result: "jdoe"
 *     let password = credential.getPassword();             // Result: "pass123"
 *     let pin = credential.getAsNullableString("pin");     // Result: 321
 */
export declare class CredentialParams extends ConfigParams {
    /**
     * Creates a new credential parameters and fills it with values.
     *
     * @param values 	(optional) an object to be converted into key-value pairs to initialize these credentials.
     */
    constructor(values?: any);
    /**
     * Checks if these credential parameters shall be retrieved from [[CredentialStore]].
     * The credential parameters are redirected to [[CredentialStore]] when store_key parameter is set.
     *
     * @returns     true if credentials shall be retrieved from [[CredentialStore]]
     *
     * @see [[getStoreKey]]
     */
    useCredentialStore(): boolean;
    /**
     * Gets the key to retrieve these credentials from [[CredentialStore]].
     * If this key is null, than all parameters are already present.
     *
     * @returns     the store key to retrieve credentials.
     *
     * @see [[useCredentialStore]]
     */
    getStoreKey(): string;
    /**
     * Sets the key to retrieve these parameters from [[CredentialStore]].
     *
     * @param value     a new key to retrieve credentials.
     */
    setStoreKey(value: string): void;
    /**
     * Gets the user name.
     * The value can be stored in parameters "username" or "user".
     *
     * @returns     the user name.
     */
    getUsername(): string;
    /**
     * Sets the user name.
     *
     * @param value     a new user name.
     */
    setUsername(value: string): void;
    /**
     * Get the user password.
     * The value can be stored in parameters "password" or "pass".
     *
     * @returns     the user password.
     */
    getPassword(): string;
    /**
     * Sets the user password.
     *
     * @param value     a new user password.
     */
    setPassword(value: string): void;
    /**
     * Gets the application access id.
     * The value can be stored in parameters "access_id" pr "client_id"
     *
     * @returns     the application access id.
     */
    getAccessId(): string;
    /**
     * Sets the application access id.
     *
     * @param value     a new application access id.
     */
    setAccessId(value: string): void;
    /**
     * Gets the application secret key.
     * The value can be stored in parameters "access_key", "client_key" or "secret_key".
     *
     * @returns     the application secret key.
     */
    getAccessKey(): string;
    /**
     * Sets the application secret key.
     *
     * @param value     a new application secret key.
     */
    setAccessKey(value: string): void;
    /**
     * Creates a new CredentialParams object filled with key-value pairs serialized as a string.
     *
     * @param line 		a string with serialized key-value pairs as "key1=value1;key2=value2;..."
     * 					Example: "Key1=123;Key2=ABC;Key3=2016-09-16T00:00:00.00Z"
     * @returns			a new CredentialParams object.
     */
    static fromString(line: string): CredentialParams;
    /**
     * Creates a new CredentialParams object filled with provided key-value pairs called tuples.
     * Tuples parameters contain a sequence of key1, value1, key2, value2, ... pairs.
     *
     * @param tuples	the tuples to fill a new CredentialParams object.
     * @returns			a new CredentialParams object.
     */
    static fromTuples(...tuples: any[]): CredentialParams;
    /**
     * Retrieves all CredentialParams from configuration parameters
     * from "credentials" section. If "credential" section is present instead,
     * than it returns a list with only one CredentialParams.
     *
     * @param config 	a configuration parameters to retrieve credentials
     * @returns			a list of retrieved CredentialParams
     */
    static manyFromConfig(config: ConfigParams): CredentialParams[];
    /**
     * Retrieves a single CredentialParams from configuration parameters
     * from "credential" section. If "credentials" section is present instead,
     * then is returns only the first credential element.
     *
     * @param config 	ConfigParams, containing a section named "credential(s)".
     * @returns			the generated CredentialParams object.
     *
     * @see [[manyFromConfig]]
     */
    static fromConfig(config: ConfigParams): CredentialParams;
}
