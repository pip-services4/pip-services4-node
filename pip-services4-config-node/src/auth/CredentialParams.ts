/** @module auth */
import { ConfigParams } from 'pip-services4-components-node';
import { StringValueMap } from 'pip-services4-commons-node';

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
export class CredentialParams extends ConfigParams {

    /**
	 * Creates a new credential parameters and fills it with values.
     * 
	 * @param values 	(optional) an object to be converted into key-value pairs to initialize these credentials.
     */
    public constructor(values: any = null) {
        super(values);
    }

    /**
     * Checks if these credential parameters shall be retrieved from [[CredentialStore]].
     * The credential parameters are redirected to [[CredentialStore]] when store_key parameter is set.
     * 
     * @returns     true if credentials shall be retrieved from [[CredentialStore]]
     * 
     * @see [[getStoreKey]]
     */
    public useCredentialStore(): boolean {
        return super.getAsNullableString("store_key") != null;
    }

    /**
     * Gets the key to retrieve these credentials from [[CredentialStore]].
     * If this key is null, than all parameters are already present.
     * 
     * @returns     the store key to retrieve credentials.
     * 
     * @see [[useCredentialStore]]
     */
    public getStoreKey(): string {
        return super.getAsNullableString("store_key");
    }

    /**
     * Sets the key to retrieve these parameters from [[CredentialStore]].
     * 
     * @param value     a new key to retrieve credentials.
     */
    public setStoreKey(value: string) {
        super.put("store_key", value);
    }

    /**
     * Gets the user name.
     * The value can be stored in parameters "username" or "user".
     * 
     * @returns     the user name.
     */
    public getUsername(): string {
        return super.getAsNullableString("username") || super.getAsNullableString("user");
    }

    /**
     * Sets the user name.
     * 
     * @param value     a new user name.
     */
    public setUsername(value: string) {
        super.put("username", value);
    }

    /**
     * Get the user password.
     * The value can be stored in parameters "password" or "pass".
     * 
     * @returns     the user password.
     */
    public getPassword(): string {
        return super.getAsNullableString("password") || super.getAsNullableString("pass");
    }

    /**
     * Sets the user password.
     * 
     * @param value     a new user password.
     */
    public setPassword(value: string) {
        super.put("password", value);
    }

    /**
     * Gets the application access id.
     * The value can be stored in parameters "access_id" pr "client_id"
     * 
     * @returns     the application access id.
     */
    public getAccessId(): string {
        return super.getAsNullableString("access_id")
            || super.getAsNullableString("client_id");
    }

    /**
     * Sets the application access id.
     * 
     * @param value     a new application access id.
     */
    public setAccessId(value: string) {
        super.put("access_id", value);
    }

    /**
     * Gets the application secret key.
     * The value can be stored in parameters "access_key", "client_key" or "secret_key".
     * 
     * @returns     the application secret key.
     */
    public getAccessKey(): string {
        return super.getAsNullableString("access_key")
            || super.getAsNullableString("client_key")
            || super.getAsNullableString("secret_key");
    }

    /**
     * Sets the application secret key.
     * 
     * @param value     a new application secret key.
     */
    public setAccessKey(value: string) {
        super.put("access_key", value);
    }

	/**
	 * Creates a new CredentialParams object filled with key-value pairs serialized as a string.
	 * 
	 * @param line 		a string with serialized key-value pairs as "key1=value1;key2=value2;..."
	 * 					Example: "Key1=123;Key2=ABC;Key3=2016-09-16T00:00:00.00Z"
	 * @returns			a new CredentialParams object.
	 */
    public static fromString(line: string): CredentialParams {
        let map = StringValueMap.fromString(line);
        return new CredentialParams(map);
    }

    /**
	 * Creates a new CredentialParams object filled with provided key-value pairs called tuples.
	 * Tuples parameters contain a sequence of key1, value1, key2, value2, ... pairs.
	 * 
	 * @param tuples	the tuples to fill a new CredentialParams object.
	 * @returns			a new CredentialParams object.
	 */
	public static fromTuples(...tuples: any[]): CredentialParams {
		let map = StringValueMap.fromTuplesArray(tuples);
		return new CredentialParams(map);
    }
    
    /**
	 * Retrieves all CredentialParams from configuration parameters
     * from "credentials" section. If "credential" section is present instead,
     * than it returns a list with only one CredentialParams.
	 * 
	 * @param config 	a configuration parameters to retrieve credentials
	 * @returns			a list of retrieved CredentialParams
	 */
    public static manyFromConfig(config: ConfigParams): CredentialParams[] {
        let result: CredentialParams[] = [];

        let credentials: ConfigParams = config.getSection("credentials");

        if (credentials.length() > 0) {
            for (let section of credentials.getSectionNames()) {
                let credential: ConfigParams = credentials.getSection(section);
                result.push(new CredentialParams(credential));
            }
        } else {
            let credential: ConfigParams = config.getSection("credential");
            if (credential.length() > 0) {
                result.push(new CredentialParams(credential));
            }
        }

        return result;
    }

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
    public static fromConfig(config: ConfigParams): CredentialParams {
        let credentials: CredentialParams[] = this.manyFromConfig(config);
        return credentials.length > 0 ? credentials[0] : null;
    }
}