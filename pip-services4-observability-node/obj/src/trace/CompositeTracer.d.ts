/** @module trace */
import { IContext } from 'pip-services4-components-node';
import { IReferenceable } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { ITracer } from './ITracer';
import { TraceTiming } from './TraceTiming';
/**
 * Aggregates all tracers from component references under a single component.
 *
 * It allows to record traces and conveniently send them to multiple destinations.
 *
 * ### References ###
 *
 * - <code>\*:tracer:\*:\*:1.0</code>     (optional) [[ITracer]] components to pass operation traces
 *
 * @see [[ITracer]]
 *
 * ### Example ###
 *
 *     class MyComponent implements IReferenceable {
 *         private _tracer: CompositeTracer = new CompositeTracer();
 *
 *         public setReferences(references: IReferences): void {
 *             this._tracer.setReferences(references);
 *             ...
 *         }
 *
 *         public myMethod(correlatonId: string): void {
 *             var timing = this._tracer.beginTrace(context, "mycomponent", "mymethod");
 *             try {
 *                 ...
 *                 timing.endTrace();
 *             } catch (err) {
 *                 timing.endFailure(err);
 *             }
 *         }
 *     }
 *
 */
export declare class CompositeTracer implements ITracer, IReferenceable {
    protected readonly _tracers: ITracer[];
    /**
     * Creates a new instance of the tracer.
     *
     * @param references     references to locate the component dependencies.
     */
    constructor(references?: IReferences);
    /**
     * Sets references to dependent components.
     *
     * @param references     references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
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
