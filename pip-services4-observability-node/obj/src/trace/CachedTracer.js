"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedTracer = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const TraceTiming_1 = require("./TraceTiming");
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
class CachedTracer {
    /**
     * Creates a new instance of the logger.
     */
    constructor() {
        this._source = null;
        this._cache = [];
        this._updated = false;
        this._lastDumpTime = new Date().getTime();
        this._maxCacheSize = 100;
        this._interval = 10000;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._interval = config.getAsLongWithDefault("options.interval", this._interval);
        this._maxCacheSize = config.getAsIntegerWithDefault("options.max_cache_size", this._maxCacheSize);
        this._source = config.getAsStringWithDefault("source", this._source);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        let contextInfo = references.getOneOptional(new pip_services4_components_node_1.Descriptor("pip-services", "context-info", "*", "*", "1.0"));
        if (contextInfo != null && this._source == null) {
            this._source = contextInfo.name;
        }
    }
    /**
     * Writes a log message to the logger destination.
     *
      * @param context     (optional) a context to trace execution through call chain.
      * @param component         a name of called component
      * @param operation         a name of the executed operation.
      * @param error             an error object associated with this trace.
      * @param duration          execution duration in milliseconds.
     */
    write(context, component, operation, error, duration) {
        let errorDesc = error != null ? pip_services4_commons_node_1.ErrorDescriptionFactory.create(error) : null;
        // Account for cases when component and operation are combined in component.
        if (operation == null || operation == "") {
            if (component != null && component != "") {
                let pos = component.lastIndexOf(".");
                if (pos > 0) {
                    operation = component.substring(pos + 1);
                    component = component.substring(0, pos);
                }
            }
        }
        let trace = {
            time: new Date(),
            source: this._source,
            component: component,
            operation: operation,
            trace_id: context != null ? context.getTraceId() : null,
            duration: duration,
            error: errorDesc
        };
        this._cache.push(trace);
        this.update();
    }
    /**
     * Records an operation trace with its name and duration
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param component         a name of called component
     * @param operation         a name of the executed operation.
     * @param duration          execution duration in milliseconds.
     */
    trace(context, component, operation, duration) {
        this.write(context, component, operation, null, duration);
    }
    /**
     * Records an operation failure with its name, duration and error
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param component         a name of called component
     * @param operation         a name of the executed operation.
     * @param error             an error object associated with this trace.
     * @param duration          execution duration in milliseconds.
     */
    failure(context, component, operation, error, duration) {
        this.write(context, component, operation, error, duration);
    }
    /**
     * Begings recording an operation trace
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param component         a name of called component
     * @param operation         a name of the executed operation.
     * @returns                 a trace timing object.
     */
    beginTrace(context, component, operation) {
        return new TraceTiming_1.TraceTiming(context, component, operation, this);
    }
    /**
     * Clears (removes) all cached log messages.
     */
    clear() {
        this._cache = [];
        this._updated = false;
    }
    /**
     * Dumps (writes) the currently cached log messages.
     *
     * @see [[write]]
     */
    dump() {
        if (this._updated) {
            if (!this._updated)
                return;
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
    update() {
        this._updated = true;
        let now = new Date().getTime();
        if (now > this._lastDumpTime + this._interval) {
            try {
                this.dump();
            }
            catch (ex) {
                // Todo: decide what to do
            }
        }
    }
}
exports.CachedTracer = CachedTracer;
//# sourceMappingURL=CachedTracer.js.map