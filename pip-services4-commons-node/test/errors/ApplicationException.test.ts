const assert = require('chai').assert;

import { ApplicationException } from '../../src/errors/ApplicationException';

suite('ApplicationException', ()=> {
    let _appEx: ApplicationException;
    let _ex: Error;

    const Category: string = "category";
    const TraceId: string = "trace_id";
    const Code: string = "code";
    const Message: string = "message";

    setup(function() {
        _ex = new Error("Cause exception");
        _appEx = new ApplicationException(Category, TraceId, Code, Message);
    });

    test('With Cause', () => {
        _appEx.withCause(_ex);

        assert.equal(_ex.message, _appEx.cause);
    });

    test('Check Parameters', () => {
        assert.equal(Category, _appEx.category);
        assert.equal(TraceId, _appEx.trace_id);
        assert.equal(Code, _appEx.code);
        assert.equal(Message, _appEx.message);
    });

    test('With Code', () => {
        let newCode = "newCode";
        let appEx = _appEx.withCode(newCode);

        assert.equal(_appEx, appEx);
        assert.equal(newCode, appEx.code);
    });

    test('With TraceId', () => {
        let newTraceId = "newTraceId";
        let appEx = _appEx.withTraceId(newTraceId);

        assert.equal(_appEx, appEx);
        assert.equal(newTraceId, appEx.trace_id);
    });

    test('With Status', () => {
        let newStatus = 777;
        let appEx = _appEx.withStatus(newStatus);

        assert.equal(_appEx, appEx);
        assert.equal(newStatus, appEx.status);
    });

    test('With Details', () => {
        let key = "key";
        let obj = {};

        let appEx = _appEx.withDetails(key, obj);
        let newObj = appEx.details.getAsObject(key);

        assert.equal(_appEx, appEx);
    });

    test('With Stack Trace', () => {
        let newTrace = "newTrace";
        let appEx = _appEx.withStackTrace(newTrace);

        assert.equal(_appEx, appEx);
        assert.equal(newTrace, appEx.stack_trace);
    });

});