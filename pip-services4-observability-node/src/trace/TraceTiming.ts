/** @module trace */

import { IContext } from 'pip-services4-components-node';

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
export class TraceTiming {
	private _start: number;
	private _tracer: ITracer;
    private _context: IContext;
	private _component: string;
    private _operation: string;

	/**
	 * Creates a new instance of the timing callback object.
	 * 
     * @param context     (optional) a context to trace execution through call chain.
	 * @param component 	an associated component name
	 * @param operation 	an associated operation name
	 * @param callback 		a callback that shall be called when endTiming is called.
	 */
	public constructor(context: IContext, component: string, operation: string, tracer: ITracer = null) {
        this._context = context;
		this._component = component;
        this._operation = operation;
		this._tracer = tracer;
		this._start = new Date().getTime();
	}

	/**
	 * Ends timing of an execution block, calculates elapsed time
	 * and records the associated trace.
	 */
	public endTrace(): void {
		if (this._tracer != null) {
			let elapsed: number = new Date().getTime() - this._start;
			this._tracer.trace(this._context, this._component, this._operation, elapsed);
		}
	}

	/**
	 * Ends timing of a failed block, calculates elapsed time
	 * and records the associated trace.
     * @param error             an error object associated with this trace.
	 */
     public endFailure(error: Error): void {
		if (this._tracer != null) {
			let elapsed: number = new Date().getTime() - this._start;
			this._tracer.failure(this._context, this._component, this._operation, error, elapsed);
		}
	}
}