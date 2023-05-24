"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceException = void 0;
/** @module refer */
const InternalException_1 = require("../errors/InternalException");
/**
 * Error when required component dependency cannot be found.
 */
class ReferenceException extends InternalException_1.InternalException {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param correlation_id    (optional) a unique transaction id to trace execution through call chain.
     * @param locator 			the locator to find reference to dependent component.
     */
    constructor(correlationId, locator) {
        super(correlationId, "REF_ERROR", "Failed to obtain reference to " + locator);
        this.withDetails("locator", locator);
    }
}
exports.ReferenceException = ReferenceException;
//# sourceMappingURL=ReferenceException.js.map