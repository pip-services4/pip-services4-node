import { Descriptor } from 'pip-services4-commons-node';
import { References } from 'pip-services4-commons-node';

import { LogTracer } from '../../src/trace/LogTracer';
import { NullLogger } from '../../src/log/NullLogger';

suite('LogTracer', ()=> {
    let _tracer: LogTracer;

    setup(function() {
        _tracer = new LogTracer();
        _tracer.setReferences(References.fromTuples(
            new Descriptor("pip-services", "logger", "null", "default", "1.0"), new NullLogger()
        ));
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