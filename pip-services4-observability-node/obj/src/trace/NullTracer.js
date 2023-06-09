"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/** @module trace */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullTracer = void 0;
const TraceTiming_1 = require("./TraceTiming");
/**
 * Dummy implementation of tracer that doesn't do anything.
 *
 * It can be used in testing or in situations when tracing is required
 * but shall be disabled.
 *
 * @see [[ITracer]]
 */
class NullTracer {
    /**
     * Creates a new instance of the tracer.
     */
    NullTracer() { }
    /**
     * Records an operation trace with its name and duration
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param component         a name of called component
     * @param operation         a name of the executed operation.
     * @param duration          execution duration in milliseconds.
     */
    trace(context, component, operation, duration) {
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
    failure(context, component, operation, error, duration) {
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
    beginTrace(context, component, operation) {
        return new TraceTiming_1.TraceTiming(context, component, operation, this);
    }
}
exports.NullTracer = NullTracer;
//# sourceMappingURL=NullTracer.js.map