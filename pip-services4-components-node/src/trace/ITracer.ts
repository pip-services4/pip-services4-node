/** @module trace */

import { TraceTiming } from './TraceTiming';

/**
 * Interface for tracer components that capture operation traces.
 */
export interface ITracer {
    /**
     * Records an operation trace with its name and duration
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param component         a name of called component
     * @param operation         a name of the executed operation. 
     * @param duration          execution duration in milliseconds. 
     */
    trace(correlationId: string, component: string, operation: string, duration: number) : void;

    /**
     * Records an operation failure with its name, duration and error
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param component         a name of called component
     * @param operation         a name of the executed operation. 
     * @param error             an error object associated with this trace.
     * @param duration          execution duration in milliseconds. 
     */
    failure(correlationId: string, component: string, operation: string, error: Error, duration: number) : void;

    /**
     * Begings recording an operation trace
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param component         a name of called component
     * @param operation         a name of the executed operation. 
     * @returns                 a trace timing object.
     */
    beginTrace(correlationId: string, component: string, operation: string) : TraceTiming;    
}