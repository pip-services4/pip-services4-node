"use strict";
/** @module clients */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectClient = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
const pip_services4_observability_node_2 = require("pip-services4-observability-node");
const pip_services4_observability_node_3 = require("pip-services4-observability-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const InstrumentTiming_1 = require("../trace/InstrumentTiming");
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
class DirectClient {
    /**
     * Creates a new instance of the client.
     */
    constructor() {
        /**
         * The open flag.
         */
        this._opened = true;
        /**
         * The logger.
         */
        this._logger = new pip_services4_observability_node_1.CompositeLogger();
        /**
         * The tracer.
         */
        this._tracer = new pip_services4_observability_node_3.CompositeTracer();
        /**
        * The performance counters
        */
        this._counters = new pip_services4_observability_node_2.CompositeCounters();
        /**
         * The dependency resolver to get service reference.
         */
        this._dependencyResolver = new pip_services4_components_node_2.DependencyResolver();
        this._dependencyResolver.put('service', 'none');
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references     references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._tracer.setReferences(references);
        this._dependencyResolver.setReferences(references);
        this._service = this._dependencyResolver.getOneRequired('service');
    }
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param name              a method name.
     * @returns InstrumentTiming object to end the time measurement.
     */
    instrument(context, name) {
        this._logger.trace(context, "Calling %s method", name);
        this._counters.incrementOne(name + ".call_count");
        const counterTiming = this._counters.beginTiming(name + ".call_time");
        const traceTiming = this._tracer.beginTrace(context, name, null);
        return new InstrumentTiming_1.InstrumentTiming(context, name, "call", this._logger, this._counters, counterTiming, traceTiming);
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
    isOpen() {
        return this._opened;
    }
    /**
     * Opens the component.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._opened) {
                return;
            }
            if (this._service == null) {
                throw new pip_services4_commons_node_1.ConnectionException(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, 'NO_CONTROLLER', 'Service reference is missing');
            }
            this._opened = true;
            this._logger.info(context, "Opened direct client");
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    close(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._opened) {
                this._logger.info(context, "Closed direct client");
            }
            this._opened = false;
        });
    }
}
exports.DirectClient = DirectClient;
//# sourceMappingURL=DirectClient.js.map