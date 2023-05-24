/** @module run */
/**
 * Helper class that closes previously opened components.
 *
 * [[IClosable]]
 */
export declare class Closer {
    /**
     * Closes specific component.
     *
     * To be closed components must implement [[ICloseable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param component 		the component that is to be closed.
     *
     * @see [[IClosable]]
     */
    static closeOne(correlationId: string, component: any): Promise<void>;
    /**
     * Closes multiple components.
     *
     * To be closed components must implement [[ICloseable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param components 		the list of components that are to be closed.
     *
     * @see [[closeOne]]
     * @see [[IClosable]]
     */
    static close(correlationId: string, components: any[]): Promise<void>;
}
