"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services4_components_node_1 = require("pip-services4-components-node");
const NullTracer_1 = require("../../src/trace/NullTracer");
suite('NullTracer', () => {
    let _tracer;
    setup(function () {
        _tracer = new NullTracer_1.NullTracer();
    });
    test('Simple Tracing', () => {
        _tracer.trace(pip_services4_components_node_1.Context.fromTraceId("123"), "mycomponent", "mymethod", 123456);
        _tracer.failure(pip_services4_components_node_1.Context.fromTraceId("123"), "mycomponent", "mymethod", new Error("Test error"), 123456);
    });
    test('Trace Timing', () => {
        let timing = _tracer.beginTrace(pip_services4_components_node_1.Context.fromTraceId("123"), "mycomponent", "mymethod");
        timing.endTrace();
        timing = _tracer.beginTrace(pip_services4_components_node_1.Context.fromTraceId("123"), "mycomponent", "mymethod");
        timing.endFailure(new Error("Test error"));
    });
});
//# sourceMappingURL=NullTracer.test.js.map