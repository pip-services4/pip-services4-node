/** @module trace */
import { IConfigurable } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';

import { TraceTiming } from './TraceTiming';
import { CompositeLogger } from '../log/CompositeLogger';
import { LogLevel } from '../log/LogLevel';
import { LogLevelConverter } from '../log/LogLevelConverter';
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
export class LogTracer implements IConfigurable, IReferenceable, ITracer {
    private readonly _logger: CompositeLogger = new CompositeLogger();
    private _logLevel: LogLevel = LogLevel.Debug;

    /**
     * Creates a new instance of the tracer.
     */
    public constructor() { }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
     public configure(config: ConfigParams): void {
        this._logLevel = LogLevelConverter.toLogLevel(
            config.getAsObject("options.log_level"),
            this._logLevel
        );
    }

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
	 * 
     */
    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
    }

    private logTrace(correlationId: string, component: string, operation: string, error: Error, duration: number) {
        let builder = "";

        if (error != null) {
            builder += "Failed to execute ";
        } else {
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
            this._logger.error(correlationId, error, builder);
        } else {
            this._logger.log(this._logLevel, correlationId, null, builder);
        }
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
        this.logTrace(correlationId, component, operation, null, duration);
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
        this.logTrace(correlationId, component, operation, error, duration);
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

}