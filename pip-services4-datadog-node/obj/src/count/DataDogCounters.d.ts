import { ConfigParams, IContext, IOpenable, IReferenceable, IReferences } from 'pip-services4-components-node';
import { CachedCounters, Counter } from 'pip-services4-observability-node';
/**
 * Performance counters that send their metrics to DataDog service.
 *
 * DataDog is a popular monitoring SaaS service. It collects logs, metrics, events
 * from infrastructure and applications and analyze them in a single place.
 *
 * ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *     - protocol:            (optional) connection protocol: http or https (default: https)
 *     - host:                (optional) host name or IP address (default: api.datadoghq.com)
 *     - port:                (optional) port number (default: 443)
 *     - uri:                 (optional) resource URI or connection string with all parameters in it
 * - credential:
 *     - access_key:          DataDog client api key
 * - options:
 *   - retries:               number of retries (default: 3)
 *   - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *   - timeout:               invocation timeout in milliseconds (default: 10 sec)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-rpc-node/classes/services.restservice.html RestService]]
 * @see [[https://pip-services4-node.github.io/pip-services4-rpc-node/classes/services.commandablehttpservice.html CommandableHttpService]]
 *
 * ### Example ###
 *
 *     let counters = new DataDogCounters();
 *     counters.configure(ConfigParams.fromTuples(
 *         "credential.access_key", "827349874395872349875493"
 *     ));
 *
 *     await counters.open("123");
 *
 *     counters.increment("mycomponent.mymethod.calls");
 *     let timing = counters.beginTiming("mycomponent.mymethod.exec_time");
 *     try {
 *         ...
 *     } finally {
 *         timing.endTiming();
 *     }
 *
 *     counters.dump();
 */
export declare class DataDogCounters extends CachedCounters implements IReferenceable, IOpenable {
    private _client;
    private _logger;
    private _opened;
    private _source;
    private _instance;
    /**
     * Creates a new instance of the performance counters.
     */
    constructor();
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
    private convertCounter;
    private convertCounters;
    /**
     * Saves the current counters measurements.
     *
     * @param counters      current counters measurements to be saves.
     */
    protected save(counters: Counter[]): void;
}
