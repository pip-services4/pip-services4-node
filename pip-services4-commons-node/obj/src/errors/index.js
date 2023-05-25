"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorDescriptionFactory = exports.ApplicationExceptionFactory = exports.UnsupportedException = exports.NotFoundException = exports.ConflictException = exports.UnauthorizedException = exports.BadRequestException = exports.FileException = exports.InvocationException = exports.ConnectionException = exports.ConfigException = exports.InvalidStateException = exports.InternalException = exports.UnknownException = exports.ApplicationException = exports.ErrorDescription = exports.ErrorCategory = void 0;
/**
 * @module errors
 *
 * Todo: Rewrite this description
 *
 * @preferred
 * Portable and localizable Exceptions classes. Each Exception, in addition to a description
 * and stack trace has a unique string code, details array (which can be used for creating
 * localized strings).
 *
 * Way to use:
 * - An existing exception class can be used.
 * - A child class that extends [[ApplicationException]] can we written.
 * - A exception can be wrapped around (into?) an existing application exception.
 *
 * Exceptions are serializable. The exception classes themselves are not serializable, but
 * they can be converted to ErrorDescriptions, which are serializable in one language, transferred
 * to the receiving side, and deserialized in another language. After deserialization, the initial
 * exception class can be restored.
 *
 * Additionally: when transferring an exception from one language to another, the exception type
 * that is closest to the initial exception type is chosen from the exceptions available in the
 * target language.
 */
var ErrorCategory_1 = require("./ErrorCategory");
Object.defineProperty(exports, "ErrorCategory", { enumerable: true, get: function () { return ErrorCategory_1.ErrorCategory; } });
var ErrorDescription_1 = require("./ErrorDescription");
Object.defineProperty(exports, "ErrorDescription", { enumerable: true, get: function () { return ErrorDescription_1.ErrorDescription; } });
var ApplicationException_1 = require("./ApplicationException");
Object.defineProperty(exports, "ApplicationException", { enumerable: true, get: function () { return ApplicationException_1.ApplicationException; } });
var UnknownException_1 = require("./UnknownException");
Object.defineProperty(exports, "UnknownException", { enumerable: true, get: function () { return UnknownException_1.UnknownException; } });
var InternalException_1 = require("./InternalException");
Object.defineProperty(exports, "InternalException", { enumerable: true, get: function () { return InternalException_1.InternalException; } });
var InvalidStateException_1 = require("./InvalidStateException");
Object.defineProperty(exports, "InvalidStateException", { enumerable: true, get: function () { return InvalidStateException_1.InvalidStateException; } });
var ConfigException_1 = require("./ConfigException");
Object.defineProperty(exports, "ConfigException", { enumerable: true, get: function () { return ConfigException_1.ConfigException; } });
var ConnectionException_1 = require("./ConnectionException");
Object.defineProperty(exports, "ConnectionException", { enumerable: true, get: function () { return ConnectionException_1.ConnectionException; } });
var InvocationException_1 = require("./InvocationException");
Object.defineProperty(exports, "InvocationException", { enumerable: true, get: function () { return InvocationException_1.InvocationException; } });
var FileException_1 = require("./FileException");
Object.defineProperty(exports, "FileException", { enumerable: true, get: function () { return FileException_1.FileException; } });
var BadRequestException_1 = require("./BadRequestException");
Object.defineProperty(exports, "BadRequestException", { enumerable: true, get: function () { return BadRequestException_1.BadRequestException; } });
var UnauthorizedException_1 = require("./UnauthorizedException");
Object.defineProperty(exports, "UnauthorizedException", { enumerable: true, get: function () { return UnauthorizedException_1.UnauthorizedException; } });
var ConflictException_1 = require("./ConflictException");
Object.defineProperty(exports, "ConflictException", { enumerable: true, get: function () { return ConflictException_1.ConflictException; } });
var NotFoundException_1 = require("./NotFoundException");
Object.defineProperty(exports, "NotFoundException", { enumerable: true, get: function () { return NotFoundException_1.NotFoundException; } });
var UnsupportedException_1 = require("./UnsupportedException");
Object.defineProperty(exports, "UnsupportedException", { enumerable: true, get: function () { return UnsupportedException_1.UnsupportedException; } });
var ApplicationExceptionFactory_1 = require("./ApplicationExceptionFactory");
Object.defineProperty(exports, "ApplicationExceptionFactory", { enumerable: true, get: function () { return ApplicationExceptionFactory_1.ApplicationExceptionFactory; } });
var ErrorDescriptionFactory_1 = require("./ErrorDescriptionFactory");
Object.defineProperty(exports, "ErrorDescriptionFactory", { enumerable: true, get: function () { return ErrorDescriptionFactory_1.ErrorDescriptionFactory; } });
//# sourceMappingURL=index.js.map