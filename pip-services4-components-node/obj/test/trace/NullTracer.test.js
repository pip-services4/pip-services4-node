"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NullTracer_1 = require("../../src/trace/NullTracer");
suite('NullTracer', () => {
    let _tracer;
    setup(function () {
        _tracer = new NullTracer_1.NullTracer();
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
//# sourceMappingURL=NullTracer.test.js.map