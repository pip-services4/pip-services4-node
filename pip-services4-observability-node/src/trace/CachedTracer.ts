/** @module trace */
import { ConfigParams } from 'pip-services4-commons-node';
import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { Descriptor } from 'pip-services4-commons-node';
import { ErrorDescription } from 'pip-services4-commons-node';
import { ErrorDescriptionFactory } from 'pip-services4-commons-node';

import { IReconfigurable } from 'pip-services4-commons-node';

import { ITracer } from './ITracer';
import { TraceTiming } from './TraceTiming';
import { OperationTrace } from './OperationTrace';
import { ContextInfo } from '../info/ContextInfo';

/**
 * Abstract tracer that caches recorded traces in memory and periodically dumps them.
 * Child classes implement saving cached traces to their specified destinations.
 * 
 * ### Configuration parameters ###
 * 
 * - source:            source (context) name
 * - options:
 *     - interval:        interval in milliseconds to save log messages (default: 10 seconds)
 *     - max_cache_size:  maximum number of messages stored in this cache (default: 100)        
 * 
 * ### References ###
 * 
 * - <code>\*:context-info:\*:\*:1.0</code>     (optional) [[ContextInfo]] to detect the context id and specify counters source
 * 
 * @see [[ITracer]]
 * @see [[OperationTrace]]
 */
export abstract class CachedTracer implements ITracer, IReconfigurable, IReferenceable {
    protected _source: string = null;
    protected _cache: OperationTrace[] = [];
    protected _updated: boolean = false;
    protected _lastDumpTime: number = new Date().getTime();
    protected _maxCacheSize: number = 100;
    protected _interval: number = 10000;
    
    /**
     * Creates a new instance of the logger.
     */
    public constructor() {}

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
     public configure(config: ConfigParams): void {
        this._interval = config.getAsLongWithDefault("options.interval", this._interval);
        this._maxCacheSize = config.getAsIntegerWithDefault("options.max_cache_size", this._maxCacheSize);
        this._source = config.getAsStringWithDefault("source", this._source);
    }

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
     public setReferences(references: IReferences) {
        let contextInfo = references.getOneOptional<ContextInfo>(
            new Descriptor("pip-services", "context-info", "*", "*", "1.0"));
        if (contextInfo != null && this._source == null) {
            this._source = contextInfo.name;
        }
    }

    /**
     * Writes a log message to the logger destination.
     * 
      * @param correlationId     (optional) transaction id to trace execution through call chain.
      * @param component         a name of called component
      * @param operation         a name of the executed operation. 
      * @param error             an error object associated with this trace.
      * @param duration          execution duration in milliseconds. 
     */
	protected write(correlationId: string, component: string, operation: string, error: Error, duration: number): void {
		let errorDesc: ErrorDescription = error != null ? ErrorDescriptionFactory.create(error) : null;

        // Account for cases when component and operation are combined in component.
        if (operation == null || operation == "") {
            if (component != null && component != "")  {
                let pos = component.lastIndexOf(".");
                if (pos > 0) {
                    operation = component.substring(pos + 1);
                    component = component.substring(0, pos);
                }
            } 
        }

        let trace: OperationTrace = <OperationTrace>{
            time: new Date(),
            source: this._source,
            component: component, 
            operation: operation,
            correlation_id: correlationId,
            duration: duration,
            error: errorDesc
        };
		
        this._cache.push(trace);
		
		this.update();
	}

    /**
     * Records an operation trace with its name and duration
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param component         a name of called component
     * @param operation         a name of the executed operation. 
     * @param duration          execution duration in milliseconds. 
     */
     public trace(correlationId: string, component: string, operation: string, duration: number) : void {
        this.write(correlationId, component, operation, null, duration);
    }

     /**
      * Records an operation failure with its name, duration and error
      * 
      * @param correlationId     (optional) transaction id to trace execution through call chain.
      * @param component         a name of called component
      * @param operation         a name of the executed operation. 
      * @param error             an error object associated with this trace.
      * @param duration          execution duration in milliseconds. 
      */
    public failure(correlationId: string, component: string, operation: string, error: Error, duration: number) : void {
        this.write(correlationId, component, operation, error, duration);
    }
 
     /**
      * Begings recording an operation trace
      * 
      * @param correlationId     (optional) transaction id to trace execution through call chain.
      * @param component         a name of called component
      * @param operation         a name of the executed operation. 
      * @returns                 a trace timing object.
      */
    public beginTrace(correlationId: string, component: string, operation: string) : TraceTiming {
        return new TraceTiming(correlationId, component, operation, this);
    }

    /**
     * Saves log messages from the cache.
     * 
     * @param messages  a list with log messages
     * @param callback  callback function that receives error or null for success.
     */
    protected abstract save(messages: OperationTrace[], callback: (err: any) => void): void;
    
    /**
     * Clears (removes) all cached log messages.
     */
    public clear(): void {
        this._cache = [];
	    this._updated = false;
    }

    /**
     * Dumps (writes) the currently cached log messages.
     * 
     * @see [[write]]
     */
    public dump(): void {
        if (this._updated) {
            if (!this._updated) return;
            
            let traces = this._cache;
            this._cache = [];
            
            this.save(traces, (err) => {
                if (err) {
                    // Adds traces back to the cache
                    traces.push(...this._cache);
                    this._cache = traces;

                    // Truncate cache
                    let deleteCount = this._cache.length - this._maxCacheSize;
                    if (deleteCount > 0)
                        this._cache.splice(0, deleteCount);
                }
            });

            this._updated = false;
            this._lastDumpTime = new Date().getTime();
        }
    }

    /**
     * Makes trace cache as updated
     * and dumps it when timeout expires.
     * 
     * @see [[dump]]
     */
    protected update(): void {
    	this._updated = true;
    	let now = new Date().getTime();

    	if (now > this._lastDumpTime + this._interval) {
    		try {
    			this.dump();
    		} catch (ex) {
    			// Todo: decide what to do
    		}
    	}
    }
}
