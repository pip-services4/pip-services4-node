import { NullTracer } from '../../src/trace/NullTracer';

suite('NullTracer', ()=> {
    let _tracer: NullTracer;

    setup(function() {
        _tracer = new NullTracer();
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