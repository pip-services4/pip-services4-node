/** @module clients */

import { ContextResolver, IContext } from 'pip-services4-components-node';
import { IOpenable } from 'pip-services4-components-node';
import { IConfigurable } from 'pip-services4-components-node';
import { IReferenceable } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { DependencyResolver } from 'pip-services4-components-node';
import { CompositeLogger } from 'pip-services4-observability-node';
import { CompositeCounters } from 'pip-services4-observability-node';
import { CompositeTracer } from 'pip-services4-observability-node';
import { ConfigParams } from 'pip-services4-components-node';
import { ConnectionException } from 'pip-services4-commons-node';

import { InstrumentTiming } from '../trace/InstrumentTiming';

/**
 * Abstract client that calls service directly in the same memory space.
 * 
 * It is used when multiple microservices are deployed in a single container (monolyth)
 * and communication between them can be done by direct calls rather then through 
 * the network.
 * 
 * ### Configuration parameters ###
 * 
 * - dependencies:
 *   - service:            override service descriptor
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>       (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:tracer:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/trace.itracer.html ITracer]] components to record traces
 * - <code>\*:service:\*:\*:1.0</code>     service to call business methods
 * 
 * ### Example ###
 * 
 *     class MyDirectClient extends DirectClient<IMyService> implements IMyClient {
 * 
 *         public constructor() {
 *           super();
 *           this._dependencyResolver.put('service', new Descriptor(
 *               "mygroup", "service", "*", "*", "*"));
 *         }
 *         ...
 * 
 *         public async getData(context: IContext, id: string): Promise<MyData> {
 *           let timing = this.instrument(context, 'myclient.get_data');
 *           try {
 *             return await this._service.getData(context, id);
 *           } catch (ex) {
 *             timing.endFailure(ex);
 *           } finally {
 *             timing.endTiming();
 *           }
 *         }
 *         ...
 *     }
 * 
 *     let client = new MyDirectClient();
 *     client.setReferences(References.fromTuples(
 *         new Descriptor("mygroup","service","default","default","1.0"), service
 *     ));
 * 
 *     let result = await client.getData("123", "1");
 */
export abstract class DirectClient<T> implements IConfigurable, IReferenceable, IOpenable {
    /** 
     * The service reference.
     */
    protected _service: T;
    /** 
     * The open flag.
     */
    protected _opened = true;
    /** 
     * The logger.
     */
    protected _logger: CompositeLogger = new CompositeLogger();
    /** 
     * The tracer.
     */
     protected _tracer: CompositeTracer = new CompositeTracer();
     /** 
     * The performance counters
     */
    protected _counters: CompositeCounters = new CompositeCounters();
    /** 
     * The dependency resolver to get service reference.
     */
    protected _dependencyResolver: DependencyResolver = new DependencyResolver();
            
    /**
     * Creates a new instance of the client.
     */
    public constructor() {
        this._dependencyResolver.put('service', 'none');
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    /**
     * Sets references to dependent components.
     * 
     * @param references     references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._tracer.setReferences(references);
        this._dependencyResolver.setReferences(references);
        this._service = this._dependencyResolver.getOneRequired<T>('service');
    }
        
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param name              a method name.
     * @returns InstrumentTiming object to end the time measurement.
     */
    protected instrument(context: IContext, name: string): InstrumentTiming {
        this._logger.trace(context, "Calling %s method", name);
        this._counters.incrementOne(name + ".call_count");

        const counterTiming = this._counters.beginTiming(name + ".call_time");
        const traceTiming = this._tracer.beginTrace(context, name, null);
        return new InstrumentTiming(context, name, "call",
            this._logger, this._counters, counterTiming, traceTiming);
    }

    // /**
    //  * Adds instrumentation to error handling.
    //  * 
    //  * @param context     (optional) a context to trace execution through call chain.
    //  * @param name              a method name.
    //  * @param err               an occured error
    //  * @param result            (optional) an execution result
    //  * @param callback          (optional) an execution callback
    //  */
    // protected instrumentError(context: IContext, name: string, err: any,
    //     result: any = null, callback: (err: any, result: any) => void = null): void {
    //     if (err != null) {
    //         this._logger.error(context, err, "Failed to call %s method", name);
    //         this._counters.incrementOne(name + '.call_errors');    
    //     }

    //     if (callback) callback(err, result);
    // }

    /**
     * Checks if the component is opened.
     * 
     * @returns true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._opened;
    }
    
    /**
     * Opens the component.
     * 
     * @param context     (optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        if (this._opened) {
            return;
        }
        
        if (this._service == null) {
            throw new ConnectionException(context != null ? ContextResolver.getTraceId(context) : null, 'NO_CONTROLLER', 'Service reference is missing');
        } 

        this._opened = true;

        this._logger.info(context, "Opened direct client");
    }

    /**
     * Closes component and frees used resources.
     * 
     * @param context     (optional) execution context to trace execution through call chain.
     */
    public async close(context: IContext): Promise<void> {
        if (this._opened) {
            this._logger.info(context, "Closed direct client");
        }

        this._opened = false;
    }

}