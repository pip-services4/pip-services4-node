"use strict";
/** @module context */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const Parameters_1 = require("../exec/Parameters");
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
     * Creates a new Parameters object filled with key-value pairs from specified object.
     *
     * @param value        an object with key-value pairs used to initialize a new Parameters.
     * @returns            a new Parameters object.
     */
    static fromValue(value) {
        return new Context(value);
    }
    /**
     * Creates a new Context object filled with provided key-value pairs called tuples.
     * Tuples parameters contain a sequence of key1, value1, key2, value2, ... pairs.
     *
     * @param tuples    the tuples to fill a new Parameters object.
     * @returns            a new Parameters object.
     *
     * @see [[AnyValueMap.fromTuplesArray]]
     */
    static fromTuples(...tuples) {
        const map = pip_services4_commons_node_1.AnyValueMap.fromTuples(...tuples);
        return new Context(map);
    }
    /**
     * Creates new Context from ConfigMap object.
     *
     * @param config     a ConfigParams that contain parameters.
     * @returns            a new Context object.
     *
     * @see [[ConfigParams]]
     */
    static fromConfig(config) {
        if (config == null) {
            return new Context();
        }
        const values = new pip_services4_commons_node_1.AnyValueMap();
        for (const key in config) {
            if (Object.prototype.hasOwnProperty.call(config, key)) {
                values.put(key, config[key]);
            }
        }
        return new Context(values);
    }
    /**
     * Creates new Context from trace id.
     *
     * @param traceId     a transaction id to trace execution through call chain.
     * @returns a new Parameters object.
     */
    static fromTraceId(traceId) {
        const map = Parameters_1.Parameters.fromTuples("trace_id", traceId);
        return new Context(map);
    }
}
exports.Context = Context;
//# sourceMappingURL=Context.js.map