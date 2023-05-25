/** @module context */

import { AnyValueMap } from 'pip-services4-commons-node';
import { JsonConverter } from 'pip-services4-commons-node';
import { IContext } from "./IContext";
import { Parameters } from '../run';

import { ConfigParams } from '../config/ConfigParams';

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
     * Gets a trace (correlation) id.
     * 
     * @returns  a trace id or <code>null</code> if it is not defined.
     */
    public getTraceId(): string {
        let context = this.get("trace_id") || this.get("trace_id");
        return context != null ? "" + context : null;
    }

    /**
     * Gets a client name.
     * 
     * @returns  a client name or <code>null</code> if it is not defined.
     */
    public getClient(): string {
        let client = this.get("client");
        return client != null ? "" + client : null;
    }

    /**
     * Gets a reference to user object.
     * 
     * @returns  a user reference or <code>null</code> if it is not defined.
     */
    public getUser(): any {
        return this.get("user");
    }

	/**
	 * Converts this map to JSON object.
	 * 
	 * @returns	a JSON representation of this map.
	 */
	public toJson(): string {
		return JsonConverter.toJson(this._values);
	}
	
	/**
	 * Creates a new Parameters object filled with key-value pairs from specified object.
	 * 
	 * @param value		an object with key-value pairs used to initialize a new Parameters.
	 * @returns			a new Parameters object.
	 */
    public static fromValue(value: any): Context {
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
	public static fromTuples(...tuples: any[]): Context {
		let map = AnyValueMap.fromTuples(...tuples);
		return new Context(map);
	}
	
	/**
	 * Creates new Context from JSON object.
	 * 
	 * @param json 	a JSON string containing parameters.
	 * @returns a new Context object.
	 * 
	 * @see [[JsonConverter.toNullableMap]]
	 */
	public static fromJson(json: string): Context {
		let map = JsonConverter.toNullableMap(json);
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
	public static fromConfig(config: ConfigParams): Context {		
		if (config == null) {
			return new Context();
		}
		
		let values = new AnyValueMap();
		for (let key in config) {
            if (config.hasOwnProperty(key)) {
			    values.put(key, config[key]);
			}
		}		
		return new Context(values);
	}    

	/**
	 * Creates new Context from trace id.
	 * 
	 * @param traceId 	a transaction id to trace execution through call chain.
	 * @returns a new Parameters object.
	 */
	public static fromTraceId(traceId: string): Context {
		let map = Parameters.fromTuples("trace_id", traceId);
		return new Context(map);
	}

}
