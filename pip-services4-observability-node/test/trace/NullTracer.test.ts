import { Context } from 'pip-services4-components-node';
import { NullTracer } from '../../src/trace/NullTracer';

suite('NullTracer', ()=> {
    let _tracer: NullTracer;

    setup(function() {
        _tracer = new NullTracer();
    });

    test('Simple Tracing', () => {
        _tracer.trace(Context.fromTuples("trace_id", "123"), "mycomponent", "mymethod", 123456);
        _tracer.failure(Context.fromTuples("trace_id", "123"), "mycomponent", "mymethod", new Error("Test error"), 123456);
    });

    test('Trace Timing', () => {
        let timing = _tracer.beginTrace(Context.fromTuples("trace_id", "123"), "mycomponent", "mymethod");
        timing.endTrace();

        timing = _tracer.beginTrace(Context.fromTuples("trace_id", "123"), "mycomponent", "mymethod");
        timing.endFailure(new Error("Test error"));
    });

});