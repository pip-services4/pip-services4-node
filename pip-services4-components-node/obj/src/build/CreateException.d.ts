/** @module build */
import { InternalException } from 'pip-services4-commons-node';
/**
 * Error raised when factory is not able to create requested component.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/errors.internalexception.html InternalException]] (in the PipServices "Commons" package)
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/errors.applicationexception.html ApplicationException]] (in the PipServices "Commons" package)
 */
export declare class CreateException extends InternalException {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param trace_id    (optional) a unique transaction id to trace execution through call chain.
     * @param messageOrLocator  human-readable error or locator of the component that cannot be created.
     */
    constructor(traceId: string, messageOrLocator: any);
}
