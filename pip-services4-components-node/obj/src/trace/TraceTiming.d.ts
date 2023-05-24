/** @module trace */
import { ITracer } from './ITracer';
/**
 * Timing object returned by {@link ITracer.beginTrace} to end timing
 * of execution block and record the associated trace.
 *
 * ### Example ###
 *
 *     let timing = tracer.beginTrace("mymethod.exec_time");
 *     try {
 *         ...
 *         timing.endTrace();
 *     } catch (err) {
 *         timing.endFailure(err);
 *     }
 *
 */
export declare class TraceTiming {
    private _start;
    private _tracer;
    private _correlationId;
    private _component;
    private _operation;
    /**
     * Creates a new instance of the timing callback object.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param component 	an associated component name
     * @param operation 	an associated operation name
     * @param callback 		a callback that shall be called when endTiming is called.
     */
    constructor(correlationId: string, component: string, operation: string, tracer?: ITracer);
    /**
     * Ends timing of an execution block, calculates elapsed time
     * and records the associated trace.
     */
    endTrace(): void;
    /**
     * Ends timing of a failed block, calculates elapsed time
     * and records the associated trace.
     * @param error             an error object associated with this trace.
     */
    endFailure(error: Error): void;
}
