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
     * 
     * @see [[IContext]]
     */
    public static getTraceId(context: IContext): string {
        return context != null ? context.getTraceId() : null;
    }

    /**
     * Extracts client name from execution context. 
     * 
     * @param context     execution context to trace execution through call chain.
     * 
     * @see [[IContext]]
     */
    public static getClient(context: IContext): string {
        return context != null ? context.getClient() : null;
    }

    /**
     * Extracts user name (identifier) from execution context. 
     * 
     * @param context     execution context to trace execution through call chain.
     * 
     * @see [[IContext]]
     */
    public static getUser(context: IContext): string {
        return context != null ? context.getUser() : null;
    }
    
}
