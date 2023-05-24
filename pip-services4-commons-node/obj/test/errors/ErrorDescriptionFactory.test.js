"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const ErrorCategory_1 = require("../../src/errors/ErrorCategory");
const ErrorDescriptionFactory_1 = require("../../src/errors/ErrorDescriptionFactory");
const ApplicationException_1 = require("../../src/errors/ApplicationException");
suite('ErrorDescriptionFactory', () => {
    test('Create From ApplicationException', () => {
        let key = "key";
        let details = "details";
        let ex = new ApplicationException_1.ApplicationException("category", "correlationId", "code", "message");
        ex.status = 777;
        ex.cause = "cause";
        ex.stack_trace = "stackTrace";
        ex.withDetails(key, details);
        let descr = ErrorDescriptionFactory_1.ErrorDescriptionFactory.create(ex);
        assert.isNotNull(descr);
        assert.equal(ex.category, descr.category);
        assert.equal(ex.correlation_id, descr.correlation_id);
        assert.equal(ex.code, descr.code);
        assert.equal(ex.message, descr.message);
        assert.equal(ex.status, descr.status);
        assert.equal(ex.cause, descr.cause);
        assert.equal(ex.stack_trace, descr.stack_trace);
        assert.equal(ex.details, descr.details);
    });
    test('Create From Error', () => {
        let ex = new Error("message");
        let descr = ErrorDescriptionFactory_1.ErrorDescriptionFactory.create(ex);
        assert.isNotNull(descr);
        assert.equal(ErrorCategory_1.ErrorCategory.Unknown, descr.category);
        assert.equal("UNKNOWN", descr.code);
        assert.equal(ex.message, descr.message);
        assert.equal(500, descr.status);
        assert.equal(ex.stack, descr.stack_trace);
    });
});
//# sourceMappingURL=ErrorDescriptionFactory.test.js.map