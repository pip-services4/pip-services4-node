/** @module run */
/**
 * Helper class that opens components.
 *
 * [[IOpenable]]
 */
export declare class Opener {
    /**
     * Checks if specified component is opened.
     *
     * To be checked components must implement [[IOpenable]] interface.
     * If they don't the call to this method returns true.
     *
     * @param component 	the component that is to be checked.
     * @returns true if component is opened and false otherwise.
     *
     * @see [[IOpenable]]
     */
    static isOpenOne(component: any): boolean;
    /**
     * Checks if all components are opened.
     *
     * To be checked components must implement [[IOpenable]] interface.
     * If they don't the call to this method returns true.
     *
     * @param components 	a list of components that are to be checked.
     * @returns true if all components are opened and false if at least one component is closed.
     *
     * @see [[isOpenOne]]
     * @see [[IOpenable]]
     */
    static isOpen(components: any[]): boolean;
    /**
     * Opens specific component.
     *
     * To be opened components must implement [[IOpenable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param component 		the component that is to be opened.
     *
     * @see [[IOpenable]]
     */
    static openOne(correlationId: string, component: any): Promise<void>;
    /**
     * Opens multiple components.
     *
     * To be opened components must implement [[IOpenable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param components 		the list of components that are to be closed.
     *
     * @see [[openOne]]
     * @see [[IOpenable]]
     */
    static open(correlationId: string, components: any[]): Promise<void>;
}
