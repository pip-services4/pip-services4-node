/**
 * Contains a reference to a component and locator to find it.
 * It is used by [[References]] to store registered component references.
 */
export declare class Reference {
    private _locator;
    private _component;
    /**
     * Create a new instance of the reference object and assigns its values.
     *
     * @param locator 		a locator to find the reference.
     * @param reference 	a reference to component.
     */
    constructor(locator: any, component: any);
    /**
     * Matches locator to this reference locator.
     *
     * Descriptors are matched using equal method.
     * All other locator types are matched using direct comparison.
     *
     * @param locator 	the locator to match.
     * @return true if locators are matching and false it they don't.
     *
     * @see [[Descriptor]]
     */
    match(locator: any): boolean;
    /**
     * Gets the stored component reference.
     *
     * @return the component's references.
     */
    getComponent(): any;
    /**
     * Gets the stored component locator.
     *
     * @return the component's locator.
     */
    getLocator(): any;
}
