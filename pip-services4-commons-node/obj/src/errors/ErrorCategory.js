"use strict";
/** @module errors */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCategory = void 0;
/**
 * Defines standard error categories to application exceptions
 * supported by PipServices toolkit.
 */
class ErrorCategory {
}
exports.ErrorCategory = ErrorCategory;
/**
 * Unknown or unexpected errors.
 */
ErrorCategory.Unknown = "Unknown";
/**
 * Internal errors caused by programming mistakes.
 */
ErrorCategory.Internal = "Internal";
/**
 * Errors related to mistakes in user-defined configurations.
 */
ErrorCategory.Misconfiguration = "Misconfiguration";
/**
 * Errors caused by incorrect object state..
 *
 * For example: business calls when the component is not ready.
 */
ErrorCategory.InvalidState = "InvalidState";
/**
 * Errors caused by remote calls timeouted and not returning results.
 * It allows to clearly separate communication related problems
 * from other application errors.
 */
ErrorCategory.NoResponse = "NoResponse";
/**
 * Errors caused by remote calls failed due to unidenfied reasons.
 */
ErrorCategory.FailedInvocation = "FailedInvocation";
/**
 * Errors in read/write local disk operations.
 */
ErrorCategory.FileError = "FileError";
/**
 * Errors due to incorrectly specified invocation parameters.
 *
 * For example: missing or incorrect parameters.
 */
ErrorCategory.BadRequest = "BadRequest";
/**
 * Access errors caused by missing user identity (authentication error)
 * or incorrect security permissions (authorization error).
 */
ErrorCategory.Unauthorized = "Unauthorized";
/**
 * Errors caused by attempts to access missing objects.
 */
ErrorCategory.NotFound = "NotFound";
/**
 * Errors raised by conflicts between object versions that were
 * posted by the user and those that are stored on the server.
 */
ErrorCategory.Conflict = "Conflict";
/**
 * Errors caused by calls to unsupported or not yet implemented functionality.
 */
ErrorCategory.Unsupported = "Unsupported";
//# sourceMappingURL=ErrorCategory.js.map