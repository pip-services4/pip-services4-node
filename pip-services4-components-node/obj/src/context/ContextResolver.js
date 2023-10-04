"use strict";
/** @module context */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextResolver = void 0;
/**
 * Context resolver that processes context and extracts values from there.
 *
 * @see [[IContext]]
 */
class ContextResolver {
    /**
     * Extracts trace id from execution context.
     *
     * @param context     execution context to trace execution through call chain.
     * @returns       a trace id or <code>null</code> if it is not defined.
     * @see [[IContext]]
     */
    static getTraceId(context) {
        if (context == null)
            return null;
        const traceId = context.get("trace_id") || context.get("traceId");
        return traceId != null ? "" + traceId : null;
    }
    /**
     * Extracts client name from execution context.
     *
     * @param context     execution context to trace execution through call chain.
     * @returns       a client name or <code>null</code> if it is not defined.
     * @see [[IContext]]
     */
    static getClient(context) {
        if (context == null)
            return null;
        const client = context.get("client");
        return client != null ? "" + client : null;
    }
    /**
     * Extracts user name (identifier) from execution context.
     *
     * @param context     execution context to trace execution through call chain.
     * @returns       a user reference or <code>null</code> if it is not defined.
     * @see [[IContext]]
     */
    static getUser(context) {
        if (context == null)
            return null;
        return context.get("user");
    }
}
exports.ContextResolver = ContextResolver;
//# sourceMappingURL=ContextResolver.js.map