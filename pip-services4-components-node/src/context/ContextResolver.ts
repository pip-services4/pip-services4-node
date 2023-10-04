/** @module context */

import { IContext } from "./IContext";

/**
 * Context resolver that processes context and extracts values from there.
 * 
 * @see [[IContext]]
 */
export class ContextResolver {
    /**
     * Extracts trace id from execution context. 
     * 
     * @param context     execution context to trace execution through call chain.
     * @returns       a trace id or <code>null</code> if it is not defined.
     * @see [[IContext]]
     */
    public static getTraceId(context: IContext): string {
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
    public static getClient(context: IContext): string {
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
    public static getUser(context: IContext): string {
        if (context == null) 
            return null;
        return context.get("user");
    }
    
}
