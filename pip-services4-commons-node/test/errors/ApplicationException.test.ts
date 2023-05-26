import chai = require('chai');
const assert = chai.assert;

import { ApplicationException } from '../../src/errors/ApplicationException';

suite('ApplicationException', ()=> {
    let _appEx: ApplicationException;
    let _ex: Error;

    const Category = "category";
    const TraceId = "trace_id";
    const Code = "code";
    const Message = "message";

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
        const newCode = "newCode";
        const appEx = _appEx.withCode(newCode);

        assert.equal(_appEx, appEx);
        assert.equal(newCode, appEx.code);
    });

    test('With TraceId', () => {
        const newTraceId = "newTraceId";
        const appEx = _appEx.withTraceId(newTraceId);

        assert.equal(_appEx, appEx);
        assert.equal(newTraceId, appEx.trace_id);
    });

    test('With Status', () => {
        const newStatus = 777;
        const appEx = _appEx.withStatus(newStatus);

        assert.equal(_appEx, appEx);
        assert.equal(newStatus, appEx.status);
    });

    test('With Details', () => {
        const key = "key";
        const obj = {};

        const appEx = _appEx.withDetails(key, obj);
        const newObj = appEx.details.getAsObject(key);

        assert.equal(_appEx, appEx);
    });

    test('With Stack Trace', () => {
        const newTrace = "newTrace";
        const appEx = _appEx.withStackTrace(newTrace);

        assert.equal(_appEx, appEx);
        assert.equal(newTrace, appEx.stack_trace);
    });

});