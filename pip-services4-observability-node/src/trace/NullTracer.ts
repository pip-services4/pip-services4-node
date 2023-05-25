/** @module trace */

import { IContext } from 'pip-services4-components-node';

import { TraceTiming } from './TraceTiming';
import { ITracer } from './ITracer';

/**
 * Dummy implementation of tracer that doesn't do anything.
 * 
 * It can be used in testing or in situations when tracing is required
 * but shall be disabled.
 * 
 * @see [[ITracer]]
 */
export class NullTracer implements ITracer {
	/**
	 * Creates a new instance of the tracer.
	 */
	public NullTracer() { }

    /**
     * Records an operation trace with its name and duration
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param component         a name of called component
     * @param operation         a name of the executed operation. 
     * @param duration          execution duration in milliseconds. 
     */
    public trace(context: IContext, component: string, operation: string, duration: number) : void {
        // Do nothing...
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
    public failure(context: IContext, component: string, operation: string, error: Error, duration: number) : void {
        // Do nothing...
    }
 
     /**
      * Begings recording an operation trace
      * 
      * @param context     (optional) a context to trace execution through call chain.
      * @param component         a name of called component
      * @param operation         a name of the executed operation. 
      * @returns                 a trace timing object.
      */
    public beginTrace(context: IContext, component: string, operation: string) : TraceTiming {
        return new TraceTiming(context, component, operation, this);
    }
}