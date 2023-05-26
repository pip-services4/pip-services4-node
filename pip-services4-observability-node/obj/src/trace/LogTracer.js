"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogTracer = void 0;
const TraceTiming_1 = require("./TraceTiming");
const CompositeLogger_1 = require("../log/CompositeLogger");
const LogLevel_1 = require("../log/LogLevel");
const LogLevelConverter_1 = require("../log/LogLevelConverter");
/**
 * Tracer that dumps recorded traces to logger.
 *
 * ### Configuration parameters ###
 *
 * - __options:__
 *     - log_level:         log level to record traces (default: debug)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>           [[ILogger]] components to dump the captured counters
 * - <code>\*:context-info:\*:\*:1.0</code>     (optional) [[ContextInfo]] to detect the context id and specify counters source
 *
 * @see [[Tracer]]
 * @see [[CachedCounters]]
 * @see [[CompositeLogger]]
 *
 * ### Example ###
 *
 *     let tracer = new LogTracer();
 *     tracer.setReferences(References.fromTuples(
 *         new Descriptor("pip-services", "logger", "console", "default", "1.0"), new ConsoleLogger()
 *     ));
 *
 *     let timing = trcer.beginTrace("123", "mycomponent", "mymethod");
 *     try {
 *         ...
 *         timing.endTrace();
 *     } catch(err) {
 *         timing.endFailure(err);
 *     }
 *
 */
class LogTracer {
    /**
     * Creates a new instance of the tracer.
     */
    constructor() {
        this._logger = new CompositeLogger_1.CompositeLogger();
        this._logLevel = LogLevel_1.LogLevel.Debug;
        //
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._logLevel = LogLevelConverter_1.LogLevelConverter.toLogLevel(config.getAsObject("options.log_level"), this._logLevel);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references     references to locate the component dependencies.
     *
     */
    setReferences(references) {
        this._logger.setReferences(references);
    }
    logTrace(context, component, operation, error, duration) {
        let builder = "";
        if (error != null) {
            builder += "Failed to execute ";
        }
        else {
            builder += "Executed ";
        }
        builder += component;
        if (operation != null && operation != "") {
            builder += ".";
            builder += operation;
        }
        if (duration > 0) {
            builder += " in " + duration + " msec";
        }
        if (error != null) {
            this._logger.error(context, error, builder);
        }
        else {
            this._logger.log(this._logLevel, context, null, builder);
        }
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
        this.logTrace(context, component, operation, null, duration);
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
        this.logTrace(context, component, operation, error, duration);
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
}
exports.LogTracer = LogTracer;
//# sourceMappingURL=LogTracer.js.map