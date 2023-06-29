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
}
