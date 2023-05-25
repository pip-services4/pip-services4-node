/** @module context */

/**
 * Interface to specify execution context.
 * 
 * @see [[Context]]
 */
export interface IContext {
    /**
     * Gets a map element specified by its key.
     * 
     * @param key     a key of the element to get.
     * @returns       the value of the map element.
     */
    get(key: string): any;

    /**
     * Gets a trace (correlation) id.
     * 
     * @returns  a trace id or <code>null</code> if it is not defined.
     */
    getTraceId(): string;

    /**
     * Gets a client name.
     * 
     * @returns  a client name or <code>null</code> if it is not defined.
     */
    getClient(): string;

    /**
     * Gets a reference to user object.
     * 
     * @returns  a user reference or <code>null</code> if it is not defined.
     */
    getUser(): string;
}
