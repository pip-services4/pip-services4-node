/** @module reflect */
/**
 * Helper class to perform property introspection and dynamic reading and writing.
 *
 * This class has symmetric implementation across all languages supported
 * by Pip.Services toolkit and used to support dynamic data processing.
 *
 * Because all languages have different casing and case sensitivity rules,
 * this PropertyReflector treats all property names as case insensitive.
 *
 * ### Example ###
 *
 *     let myObj = new MyObject();
 *
 *     let properties = PropertyReflector.getPropertyNames();
 *     PropertyReflector.hasProperty(myObj, "myProperty");
 *     let value = PropertyReflector.getProperty(myObj, "myProperty");
 *     PropertyReflector.setProperty(myObj, "myProperty", 123);
 */
export declare class PropertyReflector {
    private static matchField;
    /**
     * Checks if object has a property with specified name..
     *
     * @param obj 	an object to introspect.
     * @param name 	a name of the property to check.
     * @returns true if the object has the property and false if it doesn't.
     */
    static hasProperty(obj: any, name: string): boolean;
    /**
     * Gets value of object property specified by its name.
     *
     * @param obj 	an object to read property from.
     * @param name 	a name of the property to get.
     * @returns the property value or null if property doesn't exist or introspection failed.
     */
    static getProperty(obj: any, name: string): any;
    private static getAllFieldsOfObject;
    /**
     * Gets names of all properties implemented in specified object.
     *
     * @param obj   an objec to introspect.
     * @returns a list with property names.
     */
    static getPropertyNames(obj: any): string[];
    /**
     * Get values of all properties in specified object
     * and returns them as a map.
     *
     * @param obj   an object to get properties from.
     * @returns a map, containing the names of the object's properties and their values.
     */
    static getProperties(obj: any): any;
    /**
     * Sets value of object property specified by its name.
     *
     * If the property does not exist or introspection fails
     * this method doesn't do anything and doesn't any throw errors.
     *
     * @param obj 	an object to write property to.
     * @param name 	a name of the property to set.
     * @param value a new value for the property to set.
     */
    static setProperty(obj: any, name: string, value: any): void;
    /**
     * Sets values of some (all) object properties.
     *
     * If some properties do not exist or introspection fails
     * they are just silently skipped and no errors thrown.
     *
     * @param obj 		 an object to write properties to.
     * @param values 	a map, containing property names and their values.
     *
     * @see [[setProperty]]
     */
    static setProperties(obj: any, values: any): void;
}
