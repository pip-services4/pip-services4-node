"use strict";
/** @module context */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_commons_node_2 = require("pip-services4-commons-node");
/**
 * Basic implementation of an execution context.
 *
 * @see [[IContext]]
 * @see [[AnyValueMap]]
 */
class Context {
    /**
     * Gets a map element specified by its key.
     *
     * @param key     a key of the element to get.
     * @returns       the value of the map element.
     */
    get(key) {
        return this._values.get(key);
    }
    /**
     * Creates a new instance of the map and assigns its value.
     *
     * @param values     (optional) values to initialize this map.
     */
    constructor(values = null) {
        this._values = new pip_services4_commons_node_1.AnyValueMap(values);
    }
    /**
     * Gets a trace (correlation) id.
     *
     * @returns  a trace id or <code>null</code> if it is not defined.
     */
    getTraceId() {
        let context = this.get("trace_id") || this.get("trace_id");
        return context != null ? "" + context : null;
    }
    /**
     * Gets a client name.
     *
     * @returns  a client name or <code>null</code> if it is not defined.
     */
    getClient() {
        let client = this.get("client");
        return client != null ? "" + client : null;
    }
    /**
     * Gets a reference to user object.
     *
     * @returns  a user reference or <code>null</code> if it is not defined.
     */
    getUser() {
        return this.get("user");
    }
    /**
     * Converts this map to JSON object.
     *
     * @returns	a JSON representation of this map.
     */
    toJson() {
        return pip_services4_commons_node_2.JsonConverter.toJson(this._values);
    }
    /**
     * Creates a new Parameters object filled with key-value pairs from specified object.
     *
     * @param value		an object with key-value pairs used to initialize a new Parameters.
     * @returns			a new Parameters object.
     */
    static fromValue(value) {
        return new Context(value);
    }
    /**
     * Creates a new Context object filled with provided key-value pairs called tuples.
     * Tuples parameters contain a sequence of key1, value1, key2, value2, ... pairs.
     *
     * @param tuples	the tuples to fill a new Parameters object.
     * @returns			a new Parameters object.
     *
     * @see [[AnyValueMap.fromTuplesArray]]
     */
    static fromTuples(...tuples) {
        let map = pip_services4_commons_node_1.AnyValueMap.fromTuples(...tuples);
        return new Context(map);
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
        return new Context(map);
    }
    /**
     * Creates new Context from ConfigMap object.
     *
     * @param config 	a ConfigParams that contain parameters.
     * @returns			a new Context object.
     *
     * @see [[ConfigParams]]
     */
    static fromConfig(config) {
        if (config == null) {
            return new Context();
        }
        let values = new pip_services4_commons_node_1.AnyValueMap();
        for (let key in config) {
            if (config.hasOwnProperty(key)) {
                values.put(key, config[key]);
            }
        }
        return new Context(values);
    }
}
exports.Context = Context;
//# sourceMappingURL=Context.js.map