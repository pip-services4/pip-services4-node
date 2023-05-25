/** @module trace */
import { IContext } from 'pip-services4-components-node';
import { IConfigurable } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { IReferenceable } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { TraceTiming } from './TraceTiming';
import { ITracer } from './ITracer';
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
export declare class LogTracer implements IConfigurable, IReferenceable, ITracer {
    private readonly _logger;
    private _logLevel;
    /**
     * Creates a new instance of the tracer.
     */
    constructor();
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     *
     */
    setReferences(references: IReferences): void;
    private logTrace;
    /**
     * Records an operation trace with its name and duration
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param component         a name of called component
     * @param operation         a name of the executed operation.
     * @param duration          execution duration in milliseconds.
     */
    trace(context: IContext, component: string, operation: string, duration: number): void;
    /**
     * Records an operation failure with its name, duration and error
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param component         a name of called component
     * @param operation         a name of the executed operation.
     * @param error             an error object associated with this trace.
     * @param duration          execution duration in milliseconds.
     */
    failure(context: IContext, component: string, operation: string, error: Error, duration: number): void;
    /**
     * Begings recording an operation trace
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param component         a name of called component
     * @param operation         a name of the executed operation.
     * @returns                 a trace timing object.
     */
    beginTrace(context: IContext, component: string, operation: string): TraceTiming;
}
