"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateException = void 0;
/** @module build */
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
/**
 * Error raised when factory is not able to create requested component.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/errors.internalexception.html InternalException]] (in the PipServices "Commons" package)
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/errors.applicationexception.html ApplicationException]] (in the PipServices "Commons" package)
 */
class CreateException extends pip_services4_commons_node_1.InternalException {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param trace_id    (optional) a unique transaction id to trace execution through call chain.
     * @param messageOrLocator  human-readable error or locator of the component that cannot be created.
     */
    constructor(traceId = null, messageOrLocator) {
        super(traceId, "CANNOT_CREATE", typeof (messageOrLocator) == 'string' ? messageOrLocator
            : "Requested component " + messageOrLocator + " cannot be created");
        if (typeof (messageOrLocator) != 'string' && messageOrLocator != null) {
            this.withDetails("locator", messageOrLocator);
        }
    }
}
exports.CreateException = CreateException;
//# sourceMappingURL=CreateException.js.map