/** @module context */

import { AnyValueMap } from 'pip-services4-commons-node';
import { JsonConverter } from 'pip-services4-commons-node';
import { IContext } from "./IContext";

import { ConfigParams } from '../config/ConfigParams';
import { Parameters } from '../exec/Parameters';

/**
 * Basic implementation of an execution context.
 * 
 * @see [[IContext]]
 * @see [[AnyValueMap]]
 */
export class Context implements IContext {
    private _values: AnyValueMap;

    /**
     * Gets a map element specified by its key.
     * 
     * @param key     a key of the element to get.
     * @returns       the value of the map element.
     */
    public get(key: string): any {
        return this._values.get(key);
    }

    /**
     * Creates a new instance of the map and assigns its value.
     * 
     * @param values     (optional) values to initialize this map.
     */
    public constructor(values: any = null) {
        this._values = new AnyValueMap(values);
    }

    /**
     * Creates a new Parameters object filled with key-value pairs from specified object.
     * 
     * @param value        an object with key-value pairs used to initialize a new Parameters.
     * @returns            a new Parameters object.
     */
    public static fromValue(value: any): Context {
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
    public static fromTuples(...tuples: any[]): Context {
        const map = AnyValueMap.fromTuples(...tuples);
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
    public static fromConfig(config: ConfigParams): Context {        
        if (config == null) {
            return new Context();
        }
        
        const values = new AnyValueMap();
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
    public static fromTraceId(traceId: string): Context {
        const map = Parameters.fromTuples("trace_id", traceId);
        return new Context(map);
    }

}
