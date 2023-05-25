"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parameters = void 0;
/** @module run */
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_commons_node_2 = require("pip-services4-commons-node");
const pip_services4_commons_node_3 = require("pip-services4-commons-node");
const pip_services4_commons_node_4 = require("pip-services4-commons-node");
const pip_services4_commons_node_5 = require("pip-services4-commons-node");
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
class Parameters extends pip_services4_commons_node_1.AnyValueMap {
    /**
     * Creates a new instance of the map and assigns its value.
     *
     * @param value     (optional) values to initialize this map.
     */
    constructor(map = null) {
        super(map);
    }
    /**
     * Gets a map element specified by its key.
     *
     * The key can be defined using dot notation
     * and allows to recursively access elements of elements.
     *
     * @param key     a key of the element to get.
     * @returns       the value of the map element.
     */
    get(key) {
        if (key == null) {
            return null;
        }
        else if (key.indexOf('.') > 0) {
            return pip_services4_commons_node_3.RecursiveObjectReader.getProperty(this, key);
        }
        else {
            return super.get(key);
        }
    }
    /**
     * Puts a new value into map element specified by its key.
     *
     * The key can be defined using dot notation
     * and allows to recursively access elements of elements.
     *
     * @param key       a key of the element to put.
     * @param value     a new value for map element.
     */
    put(key, value) {
        if (key == null) {
            return null;
        }
        else if (key.indexOf('.') > 0) {
            pip_services4_commons_node_4.RecursiveObjectWriter.setProperty(this, key, value);
        }
        else {
            super.put(key, value);
        }
        return value;
    }
    /**
     * Converts map element into an Parameters or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns Parameters value of the element or null if conversion is not supported.
     */
    getAsNullableParameters(key) {
        let value = this.getAsNullableMap(key);
        return value != null ? new Parameters(value) : null;
    }
    /**
     * Converts map element into an Parameters or returns empty Parameters if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns Parameters value of the element or empty Parameters if conversion is not supported.
     */
    getAsParameters(key) {
        let value = this.getAsMap(key);
        return new Parameters(value);
    }
    /**
     * Converts map element into an Parameters or returns default value if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @param defaultValue  the default value
     * @returns Parameters value of the element or default value if conversion is not supported.
     */
    getAsParametersWithDefault(key, defaultValue) {
        let result = this.getAsNullableParameters(key);
        return result != null ? result : defaultValue;
    }
    /**
     * Checks if this map contains an element with specified key.
     *
     * The key can be defined using dot notation
     * and allows to recursively access elements of elements.
     *
     * @param key     a key to be checked
     * @returns       true if this map contains the key or false otherwise.
     */
    containsKey(key) {
        return pip_services4_commons_node_3.RecursiveObjectReader.hasProperty(this, key.toString());
    }
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
    override(parameters, recursive = false) {
        let result = new Parameters();
        if (recursive) {
            pip_services4_commons_node_4.RecursiveObjectWriter.copyProperties(result, this);
            pip_services4_commons_node_4.RecursiveObjectWriter.copyProperties(result, parameters);
        }
        else {
            pip_services4_commons_node_5.ObjectWriter.setProperties(result, this);
            pip_services4_commons_node_5.ObjectWriter.setProperties(result, parameters);
        }
        return result;
    }
    /**
     * Set default values from specified Parameters and returns a new Parameters object.
     *
     * @param defaultParameters	Parameters with default parameter values.
     * @param recursive			(optional) true to perform deep copy, and false for shallow copy. Default: false
     * @returns						a new Parameters object.
     *
     * @see [[override]]
     */
    setDefaults(defaultParameters, recursive = false) {
        let result = new Parameters();
        if (recursive) {
            pip_services4_commons_node_4.RecursiveObjectWriter.copyProperties(result, defaultParameters);
            pip_services4_commons_node_4.RecursiveObjectWriter.copyProperties(result, this);
        }
        else {
            pip_services4_commons_node_5.ObjectWriter.setProperties(result, defaultParameters);
            pip_services4_commons_node_5.ObjectWriter.setProperties(result, this);
        }
        return result;
    }
    /**
     * Assigns (copies over) properties from the specified value to this map.
     *
     * @param value 	value whose properties shall be copied over.
     */
    assignTo(value) {
        if (value == null)
            return;
        pip_services4_commons_node_4.RecursiveObjectWriter.copyProperties(value, this);
    }
    /**
     * Picks select parameters from this Parameters and returns them as a new Parameters object.
     *
     * @param paths 	keys to be picked and copied over to new Parameters.
     * @returns a new Parameters object.
     */
    pick(...paths) {
        let result = new Parameters();
        for (let path of paths) {
            if (this.containsKey(path)) {
                result.put(path, this.get(path));
            }
        }
        return result;
    }
    /**
     * Omits selected parameters from this Parameters and returns the rest as a new Parameters object.
     *
     * @param paths 	keys to be omitted from copying over to new Parameters.
     * @returns a new Parameters object.
     */
    omit(...paths) {
        let result = new Parameters(this);
        for (let path of paths) {
            result.remove(path);
        }
        return result;
    }
    /**
     * Converts this map to JSON object.
     *
     * @returns	a JSON representation of this map.
     */
    toJson() {
        return pip_services4_commons_node_2.JsonConverter.toJson(this);
    }
    /**
     * Creates a new Parameters object filled with key-value pairs from specified object.
     *
     * @param value		an object with key-value pairs used to initialize a new Parameters.
     * @returns			a new Parameters object.
     */
    static fromValue(value) {
        return new Parameters(value);
    }
    /**
     * Creates a new Parameters object filled with provided key-value pairs called tuples.
     * Tuples parameters contain a sequence of key1, value1, key2, value2, ... pairs.
     *
     * @param tuples	the tuples to fill a new Parameters object.
     * @returns			a new Parameters object.
     *
     * @see [[AnyValueMap.fromTuplesArray]]
     */
    static fromTuples(...tuples) {
        let map = pip_services4_commons_node_1.AnyValueMap.fromTuples(...tuples);
        return new Parameters(map);
    }
    /**
     * Merges two or more Parameters into one. The following Parameters override
     * previously defined parameters.
     *
     * @param configs 	a list of Parameters objects to be merged.
     * @returns			a new Parameters object.
     *
     * @see [[AnyValueMap.fromMaps]]
     */
    static mergeParams(...parameters) {
        let map = pip_services4_commons_node_1.AnyValueMap.fromMaps(...parameters);
        return new Parameters(map);
    }
    /**
     * Creates new Parameters from JSON object.
     *
     * @param json 	a JSON string containing parameters.
     * @returns a new Parameters object.
     *
     * @see [[JsonConverter.toNullableMap]]
     */
    static fromJson(json) {
        let map = pip_services4_commons_node_2.JsonConverter.toNullableMap(json);
        return new Parameters(map);
    }
    /**
     * Creates new Parameters from ConfigMap object.
     *
     * @param config 	a ConfigParams that contain parameters.
     * @returns			a new Parameters object.
     *
     * @see [[ConfigParams]]
     */
    static fromConfig(config) {
        let result = new Parameters();
        if (config == null) {
            return result;
        }
        for (let key in config) {
            if (config.hasOwnProperty(key)) {
                result.put(key, config[key]);
            }
        }
        return result;
    }
}
exports.Parameters = Parameters;
//# sourceMappingURL=Parameters.js.map