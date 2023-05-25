/** @module connect */
import { ConfigParams } from 'pip-services4-commons-node';
import { StringValueMap } from 'pip-services4-commons-node';
import { ConfigException } from 'pip-services4-commons-node';
import { CredentialParams } from 'pip-services4-components-node';
import { ConnectionParams } from 'pip-services4-components-node';

/**
 * Contains connection parameters to authenticate against Azure Functions
 * and connect to specific Azure Function.
 * 
 * The class is able to compose and parse Azure Function connection parameters.
 * 
 * ### Configuration parameters ###
 * 
 * - connections:
 *      - uri:           full connection uri with specific app and function name
 *      - protocol:      connection protocol
 *      - app_name:      alternative app name
 *      - function_name: application function name
 * - credentials:
 *      - auth_code:     authorization code or null if using custom auth
 *
 * In addition to standard parameters [[https://pip-services4-node.github.io/pip-services4-components-node/classes/auth.credentialparams.html CredentialParams]] may contain any number of custom parameters
 * 
 * @see [[AzureConnectionResolver]]
 * 
 * ### Example ###
 * 
 *     let connection = AzureConnectionParams.fromTuples(
 *         "connection.uri", "http://myapp.azurewebsites.net/api/myfunction",
 *         "connection.protocol", "http",
 *         "connection.app_name", "myapp",
 *         "connection.function_name", "myfunction",
 *         "connection.auth_code", "code",
 *     );
 *     
 *     const uri = connection.getFunctionUri();             // Result: "http://myapp.azurewebsites.net/api/myfunction"
 *     const protocol = connection.getAppName();            // Result: "http"
 *     const appName = connection.getAppName();             // Result: "myapp"
 *     const functionName = connection.getFunctionName();   // Result: "myfunction"
 *     const authCode = connection.getAuthCode();           // Result: "code"
 */
export class AzureFunctionConnectionParams extends ConfigParams {
    /**
     * Creates an new instance of the connection parameters.
     * 
	 * @param values 	(optional) an object to be converted into key-value pairs to initialize this connection.
     */
    public constructor(values: any = null) {
        super(values);
    }

    /**
     * Gets the Azure function connection protocol.
     *
     * @returns {string} the Azure function connection protocol.
     */
    public getProtocol(): string {
        return super.getAsNullableString("protocol");
    }

    /**
     * Sets the Azure function connection protocol.
     *
     * @param value a new Azure function connection protocol.
     */
    public setProtocol(value: string) {
        super.put("protocol", value);
    }

    /**
     * Gets the Azure function uri.
     *
     * @returns {string} the Azure function uri.
     */
    public getFunctionUri(): string {
        return super.getAsNullableString("uri");
    }

    /**
     * Sets the Azure function uri.
     *
     * @param value a new Azure function uri.
     */
    public setFunctionUri(value: string) {
        super.put("uri", value);
    }

    /**
     * Gets the Azure app name.
     *
     * @returns {string} the Azure app name.
     */
    public getAppName(): string {
        return super.getAsNullableString("app_name");
    }

    /**
     * Sets the Azure app name.
     *
     * @param value a new Azure app name.
     */
    public setAppName(value: string) {
        super.put("app_name", value);
    }

    /**
     * Gets the Azure function name.
     *
     * @returns {string} the Azure function name.
     */
    public getFunctionName(): string {
        return super.getAsNullableString("function_name");
    }

    /**
     * Sets the Azure function name.
     *
     * @param value a new Azure function name.
     */
    public setFunctionName(value: string) {
        super.put("function_name", value);
    }

    /**
     * Gets the Azure auth code.
     * 
     * @returns {string} the Azure auth code.
     */
    public getAuthCode(): string {
        return super.getAsNullableString("auth_code");
    }

    /**
     * Sets the Azure auth code.
     * 
     * @param value a new Azure auth code.
     */
    public setAuthCode(value: string) {
        super.put("auth_code", value);
    }

    /**
	 * Creates a new AzureConnectionParams object filled with key-value pairs serialized as a string.
	 * 
	 * @param line 		                a string with serialized key-value pairs as "key1=value1;key2=value2;..."
	 * 					                Example: "Key1=123;Key2=ABC;Key3=2016-09-16T00:00:00.00Z"
	 * @returns {AzureFunctionConnectionParams}	a new AzureConnectionParams object.
     */
    public static fromString(line: string): AzureFunctionConnectionParams {
        let map = StringValueMap.fromString(line);
        return new AzureFunctionConnectionParams(map);
    }

    /**
     * Validates this connection parameters 
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     */
    public validate(context: IContext) {
        const uri = this.getFunctionUri();
        const protocol = this.getProtocol();
        const appName = this.getAppName();
        const functionName = this.getFunctionName();

        if (uri === null && (appName === null || functionName === null || protocol === null)) {
            throw new ConfigException(
                context,
                "NO_CONNECTION_URI",
                "No uri, app_name and function_name is configured in Auzre function uri"
            );
        }

        if (protocol != null && "http" != protocol && "https" != protocol) {
            throw new ConfigException(
                context, "WRONG_PROTOCOL", "Protocol is not supported by REST connection")
                .withDetails("protocol", protocol);
        }
    }

    /**
	 * Retrieves AzureConnectionParams from configuration parameters.
     * The values are retrieves from "connection" and "credential" sections.
	 * 
	 * @param config 	                configuration parameters
	 * @returns {AzureFunctionConnectionParams}	the generated AzureConnectionParams object.
	 * 
	 * @see [[mergeConfigs]]
	 */
    public static fromConfig(config: ConfigParams): AzureFunctionConnectionParams {
        let result = new AzureFunctionConnectionParams();

        let credentials = CredentialParams.manyFromConfig(config);
        for (let credential of credentials)
            result.append(credential);

        let connections = ConnectionParams.manyFromConfig(config);
        for (let connection of connections)
            result.append(connection);

        return result;
    }

    /**
	 * Retrieves AzureConnectionParams from multiple configuration parameters.
     * The values are retrieves from "connection" and "credential" sections.
	 * 
	 * @param configs 	                a list with configuration parameters
	 * @returns {AzureFunctionConnectionParams}	the generated AzureConnectionParams object.
	 * 
	 * @see [[fromConfig]]
	 */
    public static mergeConfigs(...configs: ConfigParams[]): AzureFunctionConnectionParams {
        let config = ConfigParams.mergeConfigs(...configs);
        return new AzureFunctionConnectionParams(config);
    }

    /**
     * Creates a new ConfigParams object filled with provided key-value pairs called tuples.
     * Tuples parameters contain a sequence of key1, value1, key2, value2, ... pairs.
     *
     * @param tuples	the tuples to fill a new ConfigParams object.
     * @returns			a new ConfigParams object.
     *
     * @see [[ConfigParams.fromTuples]]
     */
    static fromTuples(...tuples: any[]): AzureFunctionConnectionParams {
        let config = ConfigParams.fromTuples(...tuples);
        return new AzureFunctionConnectionParams(config);
    }
}