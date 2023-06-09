/** @module connect */
import { IContext } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
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
export declare class GcpConnectionParams extends ConfigParams {
    /**
     * Creates an new instance of the connection parameters.
     *
     * @param values 	(optional) an object to be converted into key-value pairs to initialize this connection.
     */
    constructor(values?: any);
    /**
     * Gets the Google Platform controller connection protocol.
     *
     * @returns {string} the Google controller connection protocol.
     */
    getProtocol(): string;
    /**
     * Sets the Google Platform controller connection protocol.
     *
     * @param value a new Google controller connection protocol.
     */
    setProtocol(value: string): void;
    /**
     * Gets the Google Platform controller uri.
     *
     * @returns {string} the Google sevice uri.
     */
    getUri(): string;
    /**
     * Sets the Google Platform controller uri.
     *
     * @param value a new Google controller uri.
     */
    setUri(value: string): void;
    /**
     * Gets the Google function name.
     *
     * @returns {string} the Google function name.
     */
    getFunction(): string;
    /**
     * Sets the Google function name.
     *
     * @param value a new Google function name.
     */
    setFunction(value: string): void;
    /**
    * Gets the region where your function is deployed.
    *
    * @returns {string} the region of deployed function.
    */
    getRegion(): string;
    /**
     * Sets the region where your function is deployed.
     *
     * @param value the region of deployed function.
     */
    setRegion(value: string): void;
    /**
    * Gets the Google Cloud Platform project ID.
    *
    * @returns {string} the project ID.
    */
    getProjectId(): string;
    /**
     * Sets the Google Cloud Platform project ID.
     *
     * @param value a new project ID.
     */
    setProjectId(value: string): void;
    /**
     * Gets an ID token with the request to authenticate themselves
     *
     * @returns {string} the ID token.
     */
    getAuthToken(): string;
    /**
     * Sets an ID token with the request to authenticate themselves
     *
     * @param value a new ID token.
     */
    setAuthToken(value: string): void;
    /**
     * Gets the controller account name
     *
     * @returns {string} the account name.
     */
    getAccount(): string;
    /**
     * Sets the controller account name
     *
     * @param value a new account name.
     */
    setAccount(value: string): void;
    /**
     * Gets organization name
     *
     * @returns {string} the organization name.
     */
    getOrgId(): string;
    /**
     * Sets organization name
     *
     * @param value a new organization name.
     */
    setOrgId(value: string): void;
    /**
     * Creates a new GcpConnectionParams object filled with key-value pairs serialized as a string.
     *
     * @param line 		                a string with serialized key-value pairs as "key1=value1;key2=value2;..."
     * 					                Example: "Key1=123;Key2=ABC;Key3=2016-09-16T00:00:00.00Z"
     * @returns {GcpConnectionParams}	a new GcpConnectionParams object.
     */
    static fromString(line: string): GcpConnectionParams;
    /**
     * Validates this connection parameters
     *
     * @param context     (optional) a context to trace execution through call chain.
     */
    validate(context: IContext): void;
    /**
     * Retrieves GcpConnectionParams from configuration parameters.
     * The values are retrieves from "connection" and "credential" sections.
     *
     * @param config 	                configuration parameters
     * @returns {GcpConnectionParams}	the generated GcpConnectionParams object.
     *
     * @see [[mergeConfigs]]
     */
    static fromConfig(config: ConfigParams): GcpConnectionParams;
    /**
     * Creates a new ConfigParams object filled with provided key-value pairs called tuples.
     * Tuples parameters contain a sequence of key1, value1, key2, value2, ... pairs.
     *
     * @param tuples	the tuples to fill a new ConfigParams object.
     * @returns			a new ConfigParams object.
     */
    static fromTuples(...tuples: any[]): GcpConnectionParams;
    /**
     * Retrieves GcpConnectionParams from multiple configuration parameters.
     * The values are retrieves from "connection" and "credential" sections.
     *
     * @param configs 	                a list with configuration parameters
     * @returns {GcpConnectionParams}	the generated GcpConnectionParams object.
     *
     * @see [[fromConfig]]
     */
    static mergeConfigs(...configs: ConfigParams[]): GcpConnectionParams;
}
