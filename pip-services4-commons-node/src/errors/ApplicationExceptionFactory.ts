/** @module errors */
import { ErrorCategory } from './ErrorCategory';
import { ErrorDescription } from './ErrorDescription';
import { ApplicationException } from './ApplicationException';
import { UnknownException } from './UnknownException';
import { InternalException } from './InternalException';
import { ConfigException } from './ConfigException';
import { ConnectionException } from './ConnectionException';
import { InvocationException } from './InvocationException';
import { FileException } from './FileException';
import { BadRequestException } from './BadRequestException';
import { UnauthorizedException } from './UnauthorizedException';
import { ConflictException } from './ConflictException';
import { NotFoundException } from './NotFoundException';
import { UnsupportedException } from './UnsupportedException';
import { InvalidStateException } from './InvalidStateException';

/**
 * Factory to recreate exceptions from [[ErrorDescription]] values passed through the wire.
 * 
 * @see [[ErrorDescription]]
 * @see [[ApplicationException]]
 */
export class ApplicationExceptionFactory {
	
	/**
	 * Recreates ApplicationException object from serialized ErrorDescription.
	 * 
	 * It tries to restore original exception type using type or error category fields.
	 * 
	 * @param description	a serialized error description received as a result of remote call
	 */
    public static create(description: ErrorDescription): ApplicationException {
    	if (description == null) {
    		throw new Error("Description cannot be null");
		}
    	
    	let error: ApplicationException = null;
    	let category = description.category;
    	let code = description.code;
    	let message = description.message;
    	let traceId = description.trace_id;
    	
    	// Create well-known exception type based on error category
    	if (ErrorCategory.Unknown == category)
    		error = new UnknownException(traceId, code, message);
    	else if (ErrorCategory.Internal == category)
    		error = new InternalException(traceId, code, message);
    	else if (ErrorCategory.Misconfiguration == category)
    		error = new ConfigException(traceId, code, message);
    	else if (ErrorCategory.NoResponse == category)
    		error = new ConnectionException(traceId, code, message);
    	else if (ErrorCategory.FailedInvocation == category)
    		error = new InvocationException(traceId, code, message);
    	else if (ErrorCategory.FileError == category)
    		error = new FileException(traceId, code, message);
    	else if (ErrorCategory.BadRequest == category)
    		error = new BadRequestException(traceId, code, message);
    	else if (ErrorCategory.Unauthorized == category)
    		error = new UnauthorizedException(traceId, code, message);
    	else if (ErrorCategory.Conflict == category)
    		error = new ConflictException(traceId, code, message);
    	else if (ErrorCategory.NotFound == category)
    		error = new NotFoundException(traceId, code, message);
    	else if (ErrorCategory.InvalidState == category)
    		error = new InvalidStateException(traceId, code, message);
    	else if (ErrorCategory.Unsupported == category)
    		error = new UnsupportedException(traceId, code, message);
    	else {
    		error = new UnknownException();
    		error.category = category;
    		error.status = description.status;
    	}
    	
    	// Fill error with details
    	error.details = description.details;
        error.setCauseString(description.cause);
        error.setStackTraceString(description.stack_trace);

    	return error;
    }

}
