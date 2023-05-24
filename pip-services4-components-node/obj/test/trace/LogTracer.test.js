"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const LogTracer_1 = require("../../src/trace/LogTracer");
const NullLogger_1 = require("../../src/log/NullLogger");
suite('LogTracer', () => {
    let _tracer;
    setup(function () {
        _tracer = new LogTracer_1.LogTracer();
        _tracer.setReferences(pip_services3_commons_node_2.References.fromTuples(new pip_services3_commons_node_1.Descriptor("pip-services", "logger", "null", "default", "1.0"), new NullLogger_1.NullLogger()));
    });
    test('Simple Tracing', () => {
        _tracer.trace("123", "mycomponent", "mymethod", 123456);
        _tracer.failure("123", "mycomponent", "mymethod", new Error("Test error"), 123456);
    });
    test('Trace Timing', () => {
        let timing = _tracer.beginTrace("123", "mycomponent", "mymethod");
        timing.endTrace();
        timing = _tracer.beginTrace("123", "mycomponent", "mymethod");
        timing.endFailure(new Error("Test error"));
    });
});
//# sourceMappingURL=LogTracer.test.js.map