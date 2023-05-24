/** @module run */
import { AnyValueMap } from '../data/AnyValueMap';
import { ConfigParams } from '../config/ConfigParams';
/**
 * Contains map with execution parameters.
 *
 * In general, this map may contain non-serializable values.
 * And in contrast with other maps, its getters and setters
 * support dot notation and able to access properties
 * in the entire object graph.
 *
 * This class is often use to pass execution and notification
 * arguments, and parameterize classes before execution.
 *
 * @see [[IParameterized]]
 * @see [[AnyValueMap]]
 */
export declare class Parameters extends AnyValueMap {
    /**
     * Creates a new instance of the map and assigns its value.
     *
     * @param value     (optional) values to initialize this map.
     */
    constructor(map?: any);
    /**
     * Gets a map element specified by its key.
     *
     * The key can be defined using dot notation
     * and allows to recursively access elements of elements.
     *
     * @param key     a key of the element to get.
     * @returns       the value of the map element.
     */
    get(key: string): any;
    /**
     * Puts a new value into map element specified by its key.
     *
     * The key can be defined using dot notation
     * and allows to recursively access elements of elements.
     *
     * @param key       a key of the element to put.
     * @param value     a new value for map element.
     */
    put(key: string, value: any): any;
    /**
     * Converts map element into an Parameters or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns Parameters value of the element or null if conversion is not supported.
     */
    getAsNullableParameters(key: string): Parameters;
    /**
     * Converts map element into an Parameters or returns empty Parameters if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns Parameters value of the element or empty Parameters if conversion is not supported.
     */
    getAsParameters(key: string): Parameters;
    /**
     * Converts map element into an Parameters or returns default value if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @param defaultValue  the default value
     * @returns Parameters value of the element or default value if conversion is not supported.
     */
    getAsParametersWithDefault(key: string, defaultValue: Parameters): Parameters;
    /**
     * Checks if this map contains an element with specified key.
     *
     * The key can be defined using dot notation
     * and allows to recursively access elements of elements.
     *
     * @param key     a key to be checked
     * @returns       true if this map contains the key or false otherwise.
     */
    containsKey(key: string): boolean;
    /**
     * Overrides parameters with new values from specified Parameters
     * and returns a new Parameters object.
     *
     * @param parameters		Parameters with parameters to override the current values.
     * @param recursive			(optional) true to perform deep copy, and false for shallow copy. Default: false
     * @returns					a new Parameters object.
     *
     * @see [[setDefaults]]
     */
    override(parameters: Parameters, recursive?: boolean): Parameters;
    /**
     * Set default values from specified Parameters and returns a new Parameters object.
     *
     * @param defaultParameters	Parameters with default parameter values.
     * @param recursive			(optional) true to perform deep copy, and false for shallow copy. Default: false
     * @returns						a new Parameters object.
     *
     * @see [[override]]
     */
    setDefaults(defaultParameters: Parameters, recursive?: boolean): Parameters;
    /**
     * Assigns (copies over) properties from the specified value to this map.
     *
     * @param value 	value whose properties shall be copied over.
     */
    assignTo(value: any): void;
    /**
     * Picks select parameters from this Parameters and returns them as a new Parameters object.
     *
     * @param paths 	keys to be picked and copied over to new Parameters.
     * @returns a new Parameters object.
     */
    pick(...paths: string[]): Parameters;
    /**
     * Omits selected parameters from this Parameters and returns the rest as a new Parameters object.
     *
     * @param paths 	keys to be omitted from copying over to new Parameters.
     * @returns a new Parameters object.
     */
    omit(...paths: string[]): Parameters;
    /**
     * Converts this map to JSON object.
     *
     * @returns	a JSON representation of this map.
     */
    toJson(): string;
    /**
     * Creates a new Parameters object filled with key-value pairs from specified object.
     *
     * @param value		an object with key-value pairs used to initialize a new Parameters.
     * @returns			a new Parameters object.
     */
    static fromValue(value: any): Parameters;
    /**
     * Creates a new Parameters object filled with provided key-value pairs called tuples.
     * Tuples parameters contain a sequence of key1, value1, key2, value2, ... pairs.
     *
     * @param tuples	the tuples to fill a new Parameters object.
     * @returns			a new Parameters object.
     *
     * @see [[AnyValueMap.fromTuplesArray]]
     */
    static fromTuples(...tuples: any[]): Parameters;
    /**
     * Merges two or more Parameters into one. The following Parameters override
     * previously defined parameters.
     *
     * @param configs 	a list of Parameters objects to be merged.
     * @returns			a new Parameters object.
     *
     * @see [[AnyValueMap.fromMaps]]
     */
    static mergeParams(...parameters: Parameters[]): Parameters;
    /**
     * Creates new Parameters from JSON object.
     *
     * @param json 	a JSON string containing parameters.
     * @returns a new Parameters object.
     *
     * @see [[JsonConverter.toNullableMap]]
     */
    static fromJson(json: string): Parameters;
    /**
     * Creates new Parameters from ConfigMap object.
     *
     * @param config 	a ConfigParams that contain parameters.
     * @returns			a new Parameters object.
     *
     * @see [[ConfigParams]]
     */
    static fromConfig(config: ConfigParams): Parameters;
}
