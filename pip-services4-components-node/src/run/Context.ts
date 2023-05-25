/** @module context */

import { AnyValueMap } from 'pip-services4-commons-node';
import { JsonConverter } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { IContext } from "./IContext";

/**
 * Basic implementation of an execution context.
 * 
 * @see [[IContext]]
 * @see [[AnyValueMap]]
 */
export class Context extends AnyValueMap implements IContext {
	/**
     * Creates a new instance of the map and assigns its value.
     * 
     * @param value     (optional) values to initialize this map.
	 */
	public constructor(map: any = null) {
		super(map);
	}

    /**
     * Gets a trace (correlation) id.
     * 
     * @returns  a trace id or <code>null</code> if it is not defined.
     */
    public getTraceId(): string {
        let context = super.get("trace_id") || super.get("trace_id");
        return context != null ? "" + context : null;
    }

    /**
     * Gets a client name.
     * 
     * @returns  a client name or <code>null</code> if it is not defined.
     */
    public getClient(): string {
        let client = super.get("client");
        return client != null ? "" + client : null;
    }

    /**
     * Gets a reference to user object.
     * 
     * @returns  a user reference or <code>null</code> if it is not defined.
     */
    public getUser(): any {
        return super.get("user");
    }

	/**
	 * Converts this map to JSON object.
	 * 
	 * @returns	a JSON representation of this map.
	 */
	public toJson(): string {
		return JsonConverter.toJson(this);
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
	 * Creates new Parameters from JSON object.
	 * 
	 * @param json 	a JSON string containing parameters.
	 * @returns a new Parameters object.
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
		let result = new Context();
		
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
