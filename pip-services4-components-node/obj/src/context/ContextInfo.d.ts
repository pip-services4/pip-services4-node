import { ConfigParams } from '../config/ConfigParams';
import { IReconfigurable } from '../config/IReconfigurable';
/**
 * Context information component that provides detail information
 * about execution context: container or/and process.
 *
 * Most often ContextInfo is used by logging and performance counters
 * to identify source of the collected logs and metrics.
 *
 * ### Configuration parameters ###
 *
 * - name:                     the context (container or process) name
 * - description:                human-readable description of the context
 * - properties:             entire section of additional descriptive properties
 * - ...
 *
 * ### Example ###
 *
 *     let contextInfo = new ContextInfo();
 *     contextInfo.configure(ConfigParams.fromTuples(
 *         "name", "MyMicroservice",
 *         "description", "My first microservice"
 *     ));
 *
 *     context.name;            // Result: "MyMicroservice"
 *     context.contextId;        // Possible result: "mylaptop"
 *     context.startTime;        // Possible result: 2018-01-01:22:12:23.45Z
 *     context.uptime;            // Possible result: 3454345
 */
export declare class ContextInfo implements IReconfigurable {
    private _name;
    private _description;
    private _contextId;
    private _startTime;
    private _properties;
    /**
     * Creates a new instance of this context info.
     *
     * @param name          (optional) a context name.
     * @param description     (optional) a human-readable description of the context.
     */
    constructor(name?: string, description?: string);
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Gets the context name.
     *
     * @returns the context name
     */
    get name(): string;
    /**
     * Sets the context name.
     *
     * @param value        a new name for the context.
     */
    set name(value: string);
    /**
     * Gets the human-readable description of the context.
     *
     * @returns the human-readable description of the context.
     */
    get description(): string;
    /**
     * Sets the human-readable description of the context.
     *
     * @param value a new human readable description of the context.
     */
    set description(value: string);
    /**
     * Gets the unique context id.
     * Usually it is the current host name.
     *
     * @returns the unique context id.
     */
    get contextId(): string;
    /**
     * Sets the unique context id.
     *
     * @param value a new unique context id.
     */
    set contextId(value: string);
    /**
     * Gets the context start time.
     *
     * @returns the context start time.
     */
    get startTime(): Date;
    /**
     * Sets the context start time.
     *
     * @param value a new context start time.
     */
    set startTime(value: Date);
    /**
     * Calculates the context uptime as from the start time.
     *
     * @returns number of milliseconds from the context start time.
     */
    get uptime(): number;
    /**
     * Gets context additional parameters.
     *
     * @returns a JSON object with additional context parameters.
     */
    get properties(): any;
    /**
     * Sets context additional parameters.
     *
     * @param properties     a JSON object with context additional parameters
    */
    set properties(properties: any);
    /**
     * Creates a new ContextInfo and sets its configuration parameters.
     *
     * @param config     configuration parameters for the new ContextInfo.
     * @returns a newly created ContextInfo
     */
    static fromConfig(config: ConfigParams): ContextInfo;
}
