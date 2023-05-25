"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextInfo = void 0;
/** @module info */
/** @hidden */
const os = require('os');
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
/**
 * Context information component that provides detail information
 * about execution context: container or/and process.
 *
 * Most often ContextInfo is used by logging and performance counters
 * to identify source of the collected logs and metrics.
 *
 * ### Configuration parameters ###
 *
 * - name: 					the context (container or process) name
 * - description: 		   	human-readable description of the context
 * - properties: 			entire section of additional descriptive properties
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
 *     context.name;			// Result: "MyMicroservice"
 *     context.contextId;		// Possible result: "mylaptop"
 *     context.startTime;		// Possible result: 2018-01-01:22:12:23.45Z
 *     context.uptime;			// Possible result: 3454345
 */
class ContextInfo {
    /**
     * Creates a new instance of this context info.
     *
     * @param name  		(optional) a context name.
     * @param description 	(optional) a human-readable description of the context.
     */
    constructor(name, description) {
        this._name = "unknown";
        this._description = null;
        this._contextId = os.hostname(); // IdGenerator.nextLong();
        this._startTime = new Date();
        this._properties = new pip_services4_commons_node_1.StringValueMap();
        this._name = name || "unknown";
        this._description = description || null;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this.name = config.getAsStringWithDefault("name", this.name);
        this.description = config.getAsStringWithDefault("description", this.description);
        this.properties = config.getSection("properties");
    }
    /**
     * Gets the context name.
     *
     * @returns the context name
     */
    get name() { return this._name; }
    /**
     * Sets the context name.
     *
     * @param value		a new name for the context.
     */
    set name(value) { this._name = value || "unknown"; }
    /**
     * Gets the human-readable description of the context.
     *
     * @returns the human-readable description of the context.
     */
    get description() { return this._description; }
    /**
     * Sets the human-readable description of the context.
     *
     * @param value a new human readable description of the context.
     */
    set description(value) { this._description = value; }
    /**
     * Gets the unique context id.
     * Usually it is the current host name.
     *
     * @returns the unique context id.
     */
    get contextId() { return this._contextId; }
    /**
     * Sets the unique context id.
     *
     * @param value a new unique context id.
     */
    set contextId(value) { this._contextId = value; }
    /**
     * Gets the context start time.
     *
     * @returns the context start time.
     */
    get startTime() { return this._startTime; }
    /**
     * Sets the context start time.
     *
     * @param value a new context start time.
     */
    set startTime(value) { this._startTime = value || new Date(); }
    /**
     * Calculates the context uptime as from the start time.
     *
     * @returns number of milliseconds from the context start time.
     */
    get uptime() {
        return new Date().getTime() - this._startTime.getTime();
    }
    /**
     * Gets context additional parameters.
     *
     * @returns a JSON object with additional context parameters.
     */
    get properties() { return this._properties; }
    /**
     * Sets context additional parameters.
     *
     * @param properties 	a JSON object with context additional parameters
    */
    set properties(properties) {
        this._properties = pip_services4_commons_node_1.StringValueMap.fromValue(properties);
    }
    /**
     * Creates a new ContextInfo and sets its configuration parameters.
     *
     * @param config 	configuration parameters for the new ContextInfo.
     * @returns a newly created ContextInfo
     */
    static fromConfig(config) {
        let result = new ContextInfo();
        result.configure(config);
        return result;
    }
}
exports.ContextInfo = ContextInfo;
//# sourceMappingURL=ContextInfo.js.map