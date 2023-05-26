import chai = require('chai');
const assert = chai.assert;

import { StringValueMap } from '../../src/data/StringValueMap';
import { ErrorCategory } from '../../src/errors/ErrorCategory';
import { ErrorDescription } from '../../src/errors/ErrorDescription';
import { ApplicationExceptionFactory } from '../../src/errors/ApplicationExceptionFactory';
import { ApplicationException } from '../../src/errors/ApplicationException';
import { UnknownException } from '../../src/errors/UnknownException';
import { InternalException } from '../../src/errors/InternalException';
import { ConfigException } from '../../src/errors/ConfigException';
import { ConnectionException } from '../../src/errors/ConnectionException';
import { InvocationException } from '../../src/errors/InvocationException';
import { FileException } from '../../src/errors/FileException';
import { BadRequestException } from '../../src/errors/BadRequestException';
import { UnauthorizedException } from '../../src/errors/UnauthorizedException';
import { ConflictException } from '../../src/errors/ConflictException';
import { NotFoundException } from '../../src/errors/NotFoundException';
import { UnsupportedException } from '../../src/errors/UnsupportedException';

suite('ApplicationExceptionFactory', ()=> {

    let _descr: ErrorDescription;

    const checkProperties = (ex: ApplicationException): void => {
        assert.isNotNull(ex);

        assert.equal(_descr.cause, ex.cause);
        assert.equal(_descr.stack_trace, ex.stack_trace);
        assert.equal(_descr.details, ex.details);
        assert.equal(_descr.category, ex.category);
    }

    setup(() => {
        _descr = new ErrorDescription();
        _descr.trace_id = "trace_id";
        _descr.code = "code";
        _descr.message = "message";
        _descr.status = 777;
        _descr.cause = "cause";
        _descr.stack_trace = "stackTrace";

        const map = new StringValueMap();
        map.put("key", "value");

        _descr.details = map;
    });

    test('Create From Unknown', () => {
        _descr.category = ErrorCategory.Unknown;

        const ex = ApplicationExceptionFactory.create(_descr);

        checkProperties(ex);

        assert.isTrue(ex instanceof UnknownException);
    });

    test('Create From Internal', () => {
        _descr.category = ErrorCategory.Internal;

        const ex = ApplicationExceptionFactory.create(_descr);

        checkProperties(ex);

        assert.isTrue(ex instanceof InternalException);
    });

    test('Create From Misconfiguration', () => {
        _descr.category = ErrorCategory.Misconfiguration;

        const ex = ApplicationExceptionFactory.create(_descr);

        checkProperties(ex);

        assert.isTrue(ex instanceof ConfigException);
    });

    test('Create From No Response', () => {
        _descr.category = ErrorCategory.NoResponse;

        const ex = ApplicationExceptionFactory.create(_descr);

        checkProperties(ex);

        assert.isTrue(ex instanceof ConnectionException);
    });

    test('Create From Failed Invocation', () => {
        _descr.category = ErrorCategory.FailedInvocation;

        const ex = ApplicationExceptionFactory.create(_descr);

        checkProperties(ex);

        assert.isTrue(ex instanceof InvocationException);
    });

    test('Create From No File Access', () => {
        _descr.category = ErrorCategory.FileError;

        const ex = ApplicationExceptionFactory.create(_descr);

        checkProperties(ex);

        assert.isTrue(ex instanceof FileException);
    });

    test('Create From Bad Request', () => {
        _descr.category = ErrorCategory.BadRequest;

        const ex = ApplicationExceptionFactory.create(_descr);

        checkProperties(ex);

        assert.isTrue(ex instanceof BadRequestException);
    });

    test('Create From From Unauthorized', () => {
        _descr.category = ErrorCategory.Unauthorized;

        const ex = ApplicationExceptionFactory.create(_descr);

        checkProperties(ex);

        assert.isTrue(ex instanceof UnauthorizedException);
    });

    test('Create From Conflict', () => {
        _descr.category = ErrorCategory.Conflict;

        const ex = ApplicationExceptionFactory.create(_descr);

        checkProperties(ex);

        assert.isTrue(ex instanceof ConflictException);
    });

    test('Create From Not Found', () => {
        _descr.category = ErrorCategory.NotFound;

        const ex = ApplicationExceptionFactory.create(_descr);

        checkProperties(ex);

        assert.isTrue(ex instanceof NotFoundException);
    });

    test('Create From Unsupported', () => {
        _descr.category = ErrorCategory.Unsupported;

        const ex = ApplicationExceptionFactory.create(_descr);

        checkProperties(ex);

        assert.isTrue(ex instanceof UnsupportedException);
    });

    test('Create From Default', () => {
        _descr.category = "any_other";

        const ex = ApplicationExceptionFactory.create(_descr);

        checkProperties(ex);

        assert.isTrue(ex instanceof UnknownException);
    });

});