/** @module connect */
import { IContext } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { StringValueMap } from 'pip-services4-commons-node';
import { ConfigException } from 'pip-services4-commons-node';
import { CredentialParams } from 'pip-services4-config-node';
import { ConnectionParams } from 'pip-services4-config-node';

/**
 * Contains connection parameters to authenticate against Google
 * and connect to specific Google Cloud Platform.
 * 
 * The class is able to compose and parse Google Platform connection parameters.
 * 
 * ### Configuration parameters ###
 * 
 * - connections:                   
 *      - uri:           full connection uri with specific app and function name
 *      - protocol:      connection protocol
 *      - project_id:    is your Google Cloud Platform project ID
 *      - region:        is the region where your function is deployed
 *      - function:      is the name of the HTTP function you deployed
 *      - org_id:        organization name
 * 
 * - credentials:   
 *     - account: the controller account name 
 *     - auth_token:    Google-generated ID token or null if using custom auth (IAM)
 *
 * In addition to standard parameters [[https://pip-services4-node.github.io/pip-services4-components-node/classes/auth.credentialparams.html CredentialParams]] may contain any number of custom parameters
 * 
 * @see [[GcpConnectionResolver]]
 * 
 * 
 * ### Example ###
 * 
 *     let connection = GcpConnectionParams.fromTuples(
 *         'connection.uri', 'http://east-my_test_project.cloudfunctions.net/myfunction',
 *         'connection.protocol', 'http',
 *         'connection.region', 'east',
 *         'connection.function', 'myfunction',
 *         'connection.project_id', 'my_test_project',
 *         'credential.auth_token', '1234',
 *     );
 * 
 *     const uri = connection.getUri();             // Result: 'http://east-my_test_project.cloudfunctions.net/myfunction'
 *     const region = connection.getRegion();               // Result: 'east'
 *     const protocol = connection.getProtocol();           // Result: 'http'
 *     const functionName = connection.getFunction();   // Result: 'myfunction'
 *     const projectId = connection.getProjectId();         // Result: 'my_test_project'
 *     const authToken = connection.getAuthToken();         // Result: '123'
 */
export class GcpConnectionParams extends ConfigParams {
    /**
     * Creates an new instance of the connection parameters.
     * 
	 * @param values 	(optional) an object to be converted into key-value pairs to initialize this connection.
     */
    public constructor(values: any = null) {
        super(values);
    }

    /**
     * Gets the Google Platform controller connection protocol.
     *
     * @returns {string} the Google controller connection protocol.
     */
    public getProtocol(): string {
        return super.getAsNullableString("protocol");
    }

    /**
     * Sets the Google Platform controller connection protocol.
     *
     * @param value a new Google controller connection protocol.
     */
    public setProtocol(value: string) {
        super.put("protocol", value);
    }

    /**
     * Gets the Google Platform controller uri.
     *
     * @returns {string} the Google sevice uri.
     */
    public getUri(): string {
        return super.getAsNullableString("uri");
    }

    /**
     * Sets the Google Platform controller uri.
     *
     * @param value a new Google controller uri.
     */
    public setUri(value: string) {
        super.put("uri", value);
    }


    /**
     * Gets the Google function name.
     *
     * @returns {string} the Google function name.
     */
    public getFunction(): string {
        return super.getAsNullableString("function");
    }

    /**
     * Sets the Google function name.
     *
     * @param value a new Google function name.
     */
    public setFunction(value: string) {
        super.put("function", value);
    }

    /**
    * Gets the region where your function is deployed.
    *
    * @returns {string} the region of deployed function.
    */
    public getRegion(): string {
        return super.getAsNullableString("region");
    }

    /**
     * Sets the region where your function is deployed.
     *
     * @param value the region of deployed function.
     */
    public setRegion(value: string) {
        super.put("region", value);
    }

   /**
   * Gets the Google Cloud Platform project ID.
   *
   * @returns {string} the project ID.
   */
    public getProjectId(): string {
        return super.getAsNullableString("project_id");
    }

    /**
     * Sets the Google Cloud Platform project ID.
     *
     * @param value a new project ID.
     */
    public setProjectId(value: string) {
        super.put("project_id", value);
    }

    /**
     * Gets an ID token with the request to authenticate themselves
     *
     * @returns {string} the ID token.
     */
    public getAuthToken(): string {
        return super.getAsNullableString("auth_token");
    }

    /**
     * Sets an ID token with the request to authenticate themselves
     *
     * @param value a new ID token.
     */
    public setAuthToken(value: string) {
        super.put("auth_token", value);
    }

    /**
     * Gets the controller account name 
     *
     * @returns {string} the account name.
     */
    public getAccount(): string {
        return super.getAsNullableString("account");
    }

    /**
     * Sets the controller account name 
     *
     * @param value a new account name.
     */
    public setAccount(value: string) {
        super.put("account", value);
    }

    /**
     * Gets organization name 
     *
     * @returns {string} the organization name.
     */
    public getOrgId(): string {
        return super.getAsNullableString("org_id");
    }

    /**
     * Sets organization name
     *
     * @param value a new organization name.
     */
    public setOrgId(value: string) {
        super.put("org_id", value);
    }

    /**
	 * Creates a new GcpConnectionParams object filled with key-value pairs serialized as a string.
	 * 
	 * @param line 		                a string with serialized key-value pairs as "key1=value1;key2=value2;..."
	 * 					                Example: "Key1=123;Key2=ABC;Key3=2016-09-16T00:00:00.00Z"
	 * @returns {GcpConnectionParams}	a new GcpConnectionParams object.
     */
    public static fromString(line: string): GcpConnectionParams {
        let map = StringValueMap.fromString(line);
        return new GcpConnectionParams(map);
    }

    /**
     * Validates this connection parameters 
     * 
     * @param context     (optional) a context to trace execution through call chain.
     */
    public validate(context: IContext) {
        const uri = this.getUri();
        const protocol = this.getProtocol();
        const functionName = this.getFunction();
        const region = this.getRegion();
        const projectId = this.getProjectId();

        if (uri == null && (projectId == null ||  region == null || functionName == null || protocol == null)) {
            throw new ConfigException(
                context != null ? context.getTraceId() : null,
                "NO_CONNECTION_URI",
                "No uri, project_id, region and function is configured in Google function uri"
            );
        }

        if (protocol != null && "http" != protocol && "https" != protocol) {
            throw new ConfigException(
                context != null ? context.getTraceId() : null,
                "WRONG_PROTOCOL",
                "Protocol is not supported by REST connection"
            ).withDetails("protocol", protocol);
        }
    }

    /**
	 * Retrieves GcpConnectionParams from configuration parameters.
     * The values are retrieves from "connection" and "credential" sections.
	 * 
	 * @param config 	                configuration parameters
	 * @returns {GcpConnectionParams}	the generated GcpConnectionParams object.
	 * 
	 * @see [[mergeConfigs]]
	 */
    public static fromConfig(config: ConfigParams): GcpConnectionParams {
        let result = new GcpConnectionParams();

        let credentials = CredentialParams.manyFromConfig(config);
        for (let credential of credentials)
            result.append(credential);

        let connections = ConnectionParams.manyFromConfig(config);
        for (let connection of connections)
            result.append(connection);

        return result;
    }

    /**
     * Creates a new ConfigParams object filled with provided key-value pairs called tuples.
     * Tuples parameters contain a sequence of key1, value1, key2, value2, ... pairs.
     * 
     * @param tuples	the tuples to fill a new ConfigParams object.
     * @returns			a new ConfigParams object.
     */
    public static fromTuples(...tuples: any[]): GcpConnectionParams {
        let config = ConfigParams.fromTuples(...tuples);
        return GcpConnectionParams.fromConfig(config);
    }

    /**
	 * Retrieves GcpConnectionParams from multiple configuration parameters.
     * The values are retrieves from "connection" and "credential" sections.
	 * 
	 * @param configs 	                a list with configuration parameters
	 * @returns {GcpConnectionParams}	the generated GcpConnectionParams object.
	 * 
	 * @see [[fromConfig]]
	 */
    public static mergeConfigs(...configs: ConfigParams[]): GcpConnectionParams {
        let config = ConfigParams.mergeConfigs(...configs);
        return new GcpConnectionParams(config);
    }
}