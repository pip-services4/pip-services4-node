/** @module connect */
import { ConfigParams } from 'pip-services4-commons-node';
/**
 * Contains connection parameters to connect to external services.
 * They are used together with credential parameters, but usually stored
 * separately from more protected sensitive values.
 *
 * ### Configuration parameters ###
 *
 * - discovery_key: key to retrieve parameters from discovery service
 * - protocol:      connection protocol like http, https, tcp, udp
 * - host:          host name or IP address
 * - port:          port number
 * - uri:           resource URI or connection string with all parameters in it
 *
 * In addition to standard parameters ConnectionParams may contain any number of custom parameters
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-commons-node/classes/config.configparams.html ConfigParams]]
 * @see [[CredentialParams]]
 * @see [[ConnectionResolver]]
 * @see [[IDiscovery]]
 *
 * ### Example ###
 *
 * Example ConnectionParams object usage:
 *
 *     let connection = ConnectionParams.fromTuples(
 *         "protocol", "http",
 *         "host", "10.1.1.100",
 *         "port", "8080",
 *         "cluster", "mycluster"
 *     );
 *
 *     let host = connection.getHost();                             // Result: "10.1.1.100"
 *     let port = connection.getPort();                             // Result: 8080
 *     let cluster = connection.getAsNullableString("cluster");     // Result: "mycluster"
 */
export declare class ConnectionParams extends ConfigParams {
    /**
     * Creates a new connection parameters and fills it with values.
     *
     * @param values 	(optional) an object to be converted into key-value pairs to initialize this connection.
     */
    constructor(values?: any);
    /**
     * Checks if these connection parameters shall be retrieved from [[DiscoveryService]].
     * The connection parameters are redirected to [[DiscoveryService]] when discovery_key parameter is set.
     *
     * @returns     true if connection shall be retrieved from [[DiscoveryService]]
     *
     * @see [[getDiscoveryKey]]
     */
    useDiscovery(): boolean;
    /**
     * Gets the key to retrieve this connection from [[DiscoveryService]].
     * If this key is null, than all parameters are already present.
     *
     * @returns     the discovery key to retrieve connection.
     *
     * @see [[useDiscovery]]
     */
    getDiscoveryKey(): string;
    /**
     * Sets the key to retrieve these parameters from [[DiscoveryService]].
     *
     * @param value     a new key to retrieve connection.
     */
    setDiscoveryKey(value: string): void;
    /**
     * Gets the connection protocol.
     *
     * @returns             the connection protocol or the default value if it's not set.
     */
    getProtocol(): string;
    /**
     * Gets the connection protocol with default value.
     *
     * @param defaultValue  (optional) the default protocol
     * @returns             the connection protocol or the default value if it's not set.
     */
    getProtocolWithDefault(defaultValue: string): string;
    /**
     * Sets the connection protocol.
     *
     * @param value     a new connection protocol.
     */
    setProtocol(value: string): void;
    /**
     * Gets the host name or IP address.
     *
     * @returns     the host name or IP address.
     */
    getHost(): string;
    /**
     * Sets the host name or IP address.
     *
     * @param value     a new host name or IP address.
     */
    setHost(value: string): void;
    /**
     * Gets the port number.
     *
     * @returns the port number.
     */
    getPort(): number;
    /**
     * Gets the port number with default value.
     *
     * @param defaultPort a default port number.
     * @returns the port number.
     */
    getPortWithDefault(defaultPort: number): number;
    /**
     * Sets the port number.
     *
     * @param value     a new port number.
     *
     * @see [[getHost]]
     */
    setPort(value: number): void;
    /**
     * Gets the resource URI or connection string.
     * Usually it includes all connection parameters in it.
     *
     * @returns the resource URI or connection string.
     */
    getUri(): string;
    /**
     * Sets the resource URI or connection string.
     *
     * @param value     a new resource URI or connection string.
     */
    setUri(value: string): void;
    /**
     * Creates a new ConnectionParams object filled with key-value pairs serialized as a string.
     *
     * @param line 		a string with serialized key-value pairs as "key1=value1;key2=value2;..."
     * 					Example: "Key1=123;Key2=ABC;Key3=2016-09-16T00:00:00.00Z"
     * @returns			a new ConnectionParams object.
     *
     * @see [[StringValueMap.fromString]]
     */
    static fromString(line: string): ConnectionParams;
    /**
     * Creates a new ConnectionParams object filled with provided key-value pairs called tuples.
     * Tuples parameters contain a sequence of key1, value1, key2, value2, ... pairs.
     *
     * @param tuples	the tuples to fill a new ConnectionParams object.
     * @returns			a new ConnectionParams object.
     */
    static fromTuples(...tuples: any[]): ConnectionParams;
    /**
     * Retrieves all ConnectionParams from configuration parameters
     * from "connections" section. If "connection" section is present instead,
     * than it returns a list with only one ConnectionParams.
     *
     * @param config 	a configuration parameters to retrieve connections
     * @returns			a list of retrieved ConnectionParams
     */
    static manyFromConfig(config: ConfigParams): ConnectionParams[];
    /**
     * Retrieves a single ConnectionParams from configuration parameters
     * from "connection" section. If "connections" section is present instead,
     * then is returns only the first connection element.
     *
     * @param config 	ConnectionParams, containing a section named "connection(s)".
     * @returns			the generated ConnectionParams object.
     *
     * @see [[manyFromConfig]]
     */
    static fromConfig(config: ConfigParams): ConnectionParams;
}
