"use strict";
/** @module trace */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeTracer = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const TraceTiming_1 = require("./TraceTiming");
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
class CompositeTracer {
    /**
     * Creates a new instance of the tracer.
     *
     * @param references     references to locate the component dependencies.
     */
    constructor(references = null) {
        this._tracers = [];
        if (references != null)
            this.setReferences(references);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references     references to locate the component dependencies.
     */
    setReferences(references) {
        const tracers = references.getOptional(new pip_services4_components_node_1.Descriptor(null, "tracer", null, null, null));
        for (let i = 0; i < tracers.length; i++) {
            const tracer = tracers[i];
            if (tracer != this)
                this._tracers.push(tracer);
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
        for (const tracer of this._tracers) {
            tracer.trace(context, component, operation, duration);
        }
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
        for (const tracer of this._tracers) {
            tracer.failure(context, component, operation, error, duration);
        }
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
exports.CompositeTracer = CompositeTracer;
//# sourceMappingURL=CompositeTracer.js.map