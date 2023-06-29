/** @module context */
import { IContext } from "./IContext";
import { ConfigParams } from '../config/ConfigParams';
/**
 * Basic implementation of an execution context.
 *
 * @see [[IContext]]
 * @see [[AnyValueMap]]
 */
export declare class Context implements IContext {
    private _values;
    /**
     * Gets a map element specified by its key.
     *
     * @param key     a key of the element to get.
     * @returns       the value of the map element.
     */
    get(key: string): any;
    /**
     * Creates a new instance of the map and assigns its value.
     *
     * @param values     (optional) values to initialize this map.
     */
    constructor(values?: any);
    /**
     * Converts this map to JSON object.
     *
     * @returns    a JSON representation of this map.
     */
    toJson(): string;
    /**
     * Creates a new Parameters object filled with key-value pairs from specified object.
     *
     * @param value        an object with key-value pairs used to initialize a new Parameters.
     * @returns            a new Parameters object.
     */
    static fromValue(value: any): Context;
    /**
     * Creates a new Context object filled with provided key-value pairs called tuples.
     * Tuples parameters contain a sequence of key1, value1, key2, value2, ... pairs.
     *
     * @param tuples    the tuples to fill a new Parameters object.
     * @returns            a new Parameters object.
     *
     * @see [[AnyValueMap.fromTuplesArray]]
     */
    static fromTuples(...tuples: any[]): Context;
    /**
     * Creates new Context from JSON object.
     *
     * @param json     a JSON string containing parameters.
     * @returns a new Context object.
     *
     * @see [[JsonConverter.toNullableMap]]
     */
    static fromJson(json: string): Context;
    /**
     * Creates new Context from ConfigMap object.
     *
     * @param config     a ConfigParams that contain parameters.
     * @returns            a new Context object.
     *
     * @see [[ConfigParams]]
     */
    static fromConfig(config: ConfigParams): Context;
    /**
     * Creates new Context from trace id.
     *
     * @param traceId     a transaction id to trace execution through call chain.
     * @returns a new Parameters object.
     */
    static fromTraceId(traceId: string): Context;
}
