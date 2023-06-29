/** @module context */
import { IContext } from "./IContext";
/**
 * Context resolver that processes context and extracts values from there.
 *
 * @see [[IContext]]
 */
export declare class ContextResolver {
    /**
     * Extracts trace id from execution context.
     *
     * @param context     execution context to trace execution through call chain.
     * @returns       a trace id or <code>null</code> if it is not defined.
     * @see [[IContext]]
     */
    static getTraceId(context: IContext): string;
    /**
     * Extracts client name from execution context.
     *
     * @param context     execution context to trace execution through call chain.
     * @returns       a client name or <code>null</code> if it is not defined.
     * @see [[IContext]]
     */
    static getClient(context: IContext): string;
    /**
     * Extracts user name (identifier) from execution context.
     *
     * @param context     execution context to trace execution through call chain.
     * @returns       a user reference or <code>null</code> if it is not defined.
     * @see [[IContext]]
     */
    static getUser(context: IContext): string;
}
