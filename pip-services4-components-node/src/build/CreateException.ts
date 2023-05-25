/** @module build */
import { InternalException } from 'pip-services4-components-node';

/**
 * Error raised when factory is not able to create requested component.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/errors.internalexception.html InternalException]] (in the PipServices "Commons" package)
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/errors.applicationexception.html ApplicationException]] (in the PipServices "Commons" package)
 */
export class CreateException extends InternalException {

    /**
	 * Creates an error instance and assigns its values.
	 * 
     * @param correlation_id    (optional) a unique transaction id to trace execution through call chain.
     * @param messageOrLocator  human-readable error or locator of the component that cannot be created.
     */
	public constructor(correlationId: string = null, messageOrLocator: any) {
		super(
            correlationId, 
            "CANNOT_CREATE", 
            typeof(messageOrLocator) == 'string' ? messageOrLocator
                : "Requested component " + messageOrLocator + " cannot be created"
        );

        if (typeof(messageOrLocator) != 'string' && messageOrLocator != null) {
		    this.withDetails("locator", messageOrLocator);
        }
	}
    
}
