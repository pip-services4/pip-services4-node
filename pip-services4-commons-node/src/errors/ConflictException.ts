/** @module errors */
import { ErrorCategory } from './ErrorCategory';
import { ApplicationException } from './ApplicationException';

/**
 * Errors raised by conflicts between object versions that were
 * posted by the user and those that are stored on the server.
 */
export class ConflictException extends ApplicationException {

	/**
	 * Creates an error instance and assigns its values.
	 * 
     * @param trace_id    (optional) a unique transaction id to trace execution through call chain.
     * @param code              (optional) a unique error code. Default: "UNKNOWN"
     * @param message           (optional) a human-readable description of the error.
	 * 
	 * @see [[ErrorCategory]]
	 */
	public constructor(trace_id: string = null, code: string = null, message: string = null) {
		super(ErrorCategory.Conflict, trace_id, code, message);

        // Set the prototype explicitly.
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        (<any>this).__proto__ = ConflictException.prototype;

		this.status = 409;
	}
}
