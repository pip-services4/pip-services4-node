"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceException = void 0;
/** @module refer */
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
/**
 * Error when required component dependency cannot be found.
 */
class ReferenceException extends pip_services4_commons_node_1.InternalException {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param trace_id    (optional) a unique transaction id to trace execution through call chain.
     * @param locator             the locator to find reference to dependent component.
     */
    constructor(context, locator) {
        super(context != null ? context.getTraceId() : null, "REF_ERROR", "Failed to obtain reference to " + locator);
        this.withDetails("locator", locator);
    }
}
exports.ReferenceException = ReferenceException;
//# sourceMappingURL=ReferenceException.js.map