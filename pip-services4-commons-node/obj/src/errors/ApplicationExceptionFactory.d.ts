import { ErrorDescription } from './ErrorDescription';
import { ApplicationException } from './ApplicationException';
/**
 * Factory to recreate exceptions from [[ErrorDescription]] values passed through the wire.
 *
 * @see [[ErrorDescription]]
 * @see [[ApplicationException]]
 */
export declare class ApplicationExceptionFactory {
    /**
     * Recreates ApplicationException object from serialized ErrorDescription.
     *
     * It tries to restore original exception type using type or error category fields.
     *
     * @param description	a serialized error description received as a result of remote call
     */
    static create(description: ErrorDescription): ApplicationException;
}
