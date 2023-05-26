"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const assert = chai.assert;
const StringValueMap_1 = require("../../src/data/StringValueMap");
const ErrorCategory_1 = require("../../src/errors/ErrorCategory");
const ErrorDescription_1 = require("../../src/errors/ErrorDescription");
const ApplicationExceptionFactory_1 = require("../../src/errors/ApplicationExceptionFactory");
const UnknownException_1 = require("../../src/errors/UnknownException");
const InternalException_1 = require("../../src/errors/InternalException");
const ConfigException_1 = require("../../src/errors/ConfigException");
const ConnectionException_1 = require("../../src/errors/ConnectionException");
const InvocationException_1 = require("../../src/errors/InvocationException");
const FileException_1 = require("../../src/errors/FileException");
const BadRequestException_1 = require("../../src/errors/BadRequestException");
const UnauthorizedException_1 = require("../../src/errors/UnauthorizedException");
const ConflictException_1 = require("../../src/errors/ConflictException");
const NotFoundException_1 = require("../../src/errors/NotFoundException");
const UnsupportedException_1 = require("../../src/errors/UnsupportedException");
suite('ApplicationExceptionFactory', () => {
    let _descr;
    const checkProperties = (ex) => {
        assert.isNotNull(ex);
        assert.equal(_descr.cause, ex.cause);
        assert.equal(_descr.stack_trace, ex.stack_trace);
        assert.equal(_descr.details, ex.details);
        assert.equal(_descr.category, ex.category);
    };
    setup(() => {
        _descr = new ErrorDescription_1.ErrorDescription();
        _descr.trace_id = "trace_id";
        _descr.code = "code";
        _descr.message = "message";
        _descr.status = 777;
        _descr.cause = "cause";
        _descr.stack_trace = "stackTrace";
        const map = new StringValueMap_1.StringValueMap();
        map.put("key", "value");
        _descr.details = map;
    });
    test('Create From Unknown', () => {
        _descr.category = ErrorCategory_1.ErrorCategory.Unknown;
        const ex = ApplicationExceptionFactory_1.ApplicationExceptionFactory.create(_descr);
        checkProperties(ex);
        assert.isTrue(ex instanceof UnknownException_1.UnknownException);
    });
    test('Create From Internal', () => {
        _descr.category = ErrorCategory_1.ErrorCategory.Internal;
        const ex = ApplicationExceptionFactory_1.ApplicationExceptionFactory.create(_descr);
        checkProperties(ex);
        assert.isTrue(ex instanceof InternalException_1.InternalException);
    });
    test('Create From Misconfiguration', () => {
        _descr.category = ErrorCategory_1.ErrorCategory.Misconfiguration;
        const ex = ApplicationExceptionFactory_1.ApplicationExceptionFactory.create(_descr);
        checkProperties(ex);
        assert.isTrue(ex instanceof ConfigException_1.ConfigException);
    });
    test('Create From No Response', () => {
        _descr.category = ErrorCategory_1.ErrorCategory.NoResponse;
        const ex = ApplicationExceptionFactory_1.ApplicationExceptionFactory.create(_descr);
        checkProperties(ex);
        assert.isTrue(ex instanceof ConnectionException_1.ConnectionException);
    });
    test('Create From Failed Invocation', () => {
        _descr.category = ErrorCategory_1.ErrorCategory.FailedInvocation;
        const ex = ApplicationExceptionFactory_1.ApplicationExceptionFactory.create(_descr);
        checkProperties(ex);
        assert.isTrue(ex instanceof InvocationException_1.InvocationException);
    });
    test('Create From No File Access', () => {
        _descr.category = ErrorCategory_1.ErrorCategory.FileError;
        const ex = ApplicationExceptionFactory_1.ApplicationExceptionFactory.create(_descr);
        checkProperties(ex);
        assert.isTrue(ex instanceof FileException_1.FileException);
    });
    test('Create From Bad Request', () => {
        _descr.category = ErrorCategory_1.ErrorCategory.BadRequest;
        const ex = ApplicationExceptionFactory_1.ApplicationExceptionFactory.create(_descr);
        checkProperties(ex);
        assert.isTrue(ex instanceof BadRequestException_1.BadRequestException);
    });
    test('Create From From Unauthorized', () => {
        _descr.category = ErrorCategory_1.ErrorCategory.Unauthorized;
        const ex = ApplicationExceptionFactory_1.ApplicationExceptionFactory.create(_descr);
        checkProperties(ex);
        assert.isTrue(ex instanceof UnauthorizedException_1.UnauthorizedException);
    });
    test('Create From Conflict', () => {
        _descr.category = ErrorCategory_1.ErrorCategory.Conflict;
        const ex = ApplicationExceptionFactory_1.ApplicationExceptionFactory.create(_descr);
        checkProperties(ex);
        assert.isTrue(ex instanceof ConflictException_1.ConflictException);
    });
    test('Create From Not Found', () => {
        _descr.category = ErrorCategory_1.ErrorCategory.NotFound;
        const ex = ApplicationExceptionFactory_1.ApplicationExceptionFactory.create(_descr);
        checkProperties(ex);
        assert.isTrue(ex instanceof NotFoundException_1.NotFoundException);
    });
    test('Create From Unsupported', () => {
        _descr.category = ErrorCategory_1.ErrorCategory.Unsupported;
        const ex = ApplicationExceptionFactory_1.ApplicationExceptionFactory.create(_descr);
        checkProperties(ex);
        assert.isTrue(ex instanceof UnsupportedException_1.UnsupportedException);
    });
    test('Create From Default', () => {
        _descr.category = "any_other";
        const ex = ApplicationExceptionFactory_1.ApplicationExceptionFactory.create(_descr);
        checkProperties(ex);
        assert.isTrue(ex instanceof UnknownException_1.UnknownException);
    });
});
//# sourceMappingURL=ApplicationExceptionFactory.test.js.map