/**
 * Helper class to perform property introspection and dynamic reading.
 *
 * It is similar to [[ObjectReader]] but reads properties recursively
 * through the entire object graph. Nested property names are defined
 * using dot notation as "object.subobject.property"
 *
 * @see [[PropertyReflector]]
 * @see [[ObjectReader]]
 */
export declare class RecursiveObjectReader {
    private static performHasProperty;
    /**
     * Checks recursively if object or its subobjects has a property with specified name.
     *
     * The object can be a user defined object, map or array.
     * The property name correspondently must be object property,
     * map key or array index.
     *
     * @param obj 	an object to introspect.
     * @param name 	a name of the property to check.
     * @returns true if the object has the property and false if it doesn't.
     */
    static hasProperty(obj: any, name: string): boolean;
    private static performGetProperty;
    /**
     * Recursively gets value of object or its subobjects property specified by its name.
     *
     * The object can be a user defined object, map or array.
     * The property name correspondently must be object property,
     * map key or array index.
     *
     * @param obj 	an object to read property from.
     * @param name 	a name of the property to get.
     * @returns the property value or null if property doesn't exist or introspection failed.
     */
    static getProperty(obj: any, name: string): any;
    private static isSimpleValue;
    private static performGetPropertyNames;
    /**
     * Recursively gets names of all properties implemented in specified object and its subobjects.
     *
     * The object can be a user defined object, map or array.
     * Returned property name correspondently are object properties,
     * map keys or array indexes.
     *
     * @param obj   an objec to introspect.
     * @returns a list with property names.
     */
    static getPropertyNames(obj: any): string[];
    private static performGetProperties;
    /**
     * Get values of all properties in specified object and its subobjects
     * and returns them as a map.
     *
     * The object can be a user defined object, map or array.
     * Returned properties correspondently are object properties,
     * map key-pairs or array elements with their indexes.
     *
     * @param obj   an object to get properties from.
     * @returns a map, containing the names of the object's properties and their values.
     */
    static getProperties(obj: any): any;
}
