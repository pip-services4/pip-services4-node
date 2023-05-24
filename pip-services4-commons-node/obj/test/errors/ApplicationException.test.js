"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const ApplicationException_1 = require("../../src/errors/ApplicationException");
suite('ApplicationException', () => {
    let _appEx;
    let _ex;
    const Category = "category";
    const CorrelationId = "correlationId";
    const Code = "code";
    const Message = "message";
    setup(function () {
        _ex = new Error("Cause exception");
        _appEx = new ApplicationException_1.ApplicationException(Category, CorrelationId, Code, Message);
    });
    test('With Cause', () => {
        _appEx.withCause(_ex);
        assert.equal(_ex.message, _appEx.cause);
    });
    test('Check Parameters', () => {
        assert.equal(Category, _appEx.category);
        assert.equal(CorrelationId, _appEx.correlation_id);
        assert.equal(Code, _appEx.code);
        assert.equal(Message, _appEx.message);
    });
    test('With Code', () => {
        let newCode = "newCode";
        let appEx = _appEx.withCode(newCode);
        assert.equal(_appEx, appEx);
        assert.equal(newCode, appEx.code);
    });
    test('With CorrelationId', () => {
        let newCorrelationId = "newCorrelationId";
        let appEx = _appEx.withCorrelationId(newCorrelationId);
        assert.equal(_appEx, appEx);
        assert.equal(newCorrelationId, appEx.correlation_id);
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
//# sourceMappingURL=ApplicationException.test.js.map