/**
 * Helper class to perform property introspection and dynamic reading.
 *
 * In contrast to [[PropertyReflector]] which only introspects regular objects,
 * this ObjectReader is also able to handle maps and arrays.
 * For maps properties are key-pairs identified by string keys,
 * For arrays properties are elements identified by integer index.
 *
 * This class has symmetric implementation across all languages supported
 * by Pip.Services toolkit and used to support dynamic data processing.
 *
 * Because all languages have different casing and case sensitivity rules,
 * this ObjectReader treats all property names as case insensitive.
 *
 * @see [[PropertyReflector]]
 *
 * ### Example ###
 *
 *     let myObj = new MyObject();
 *
 *     let properties = ObjectReader.getPropertyNames();
 *     ObjectReader.hasProperty(myObj, "myProperty");
 *     let value = PropertyReflector.getProperty(myObj, "myProperty");
 *
 *     let myMap = { key1: 123, key2: "ABC" };
 *     ObjectReader.hasProperty(myMap, "key1");
 *     let value = ObjectReader.getProperty(myMap, "key1");
 *
 *     let myArray = [1, 2, 3]
 *     ObjectReader.hasProperty(myArrat, "0");
 *     let value = ObjectReader.getProperty(myArray, "0");
 */
export declare class ObjectReader {
    /**
     * Gets a real object value.
     * If object is a wrapper, it unwraps the value behind it.
     * Otherwise it returns the same object value.
     *
     * @param obj   an object to unwrap..
     * @returns an actual (unwrapped) object value.
     */
    static getValue(obj: any): any;
    /**
     * Checks if object has a property with specified name.
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
    /**
     * Gets value of object property specified by its name.
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
    /**
     * Gets names of all properties implemented in specified object.
     *
     * The object can be a user defined object, map or array.
     * Returned property name correspondently are object properties,
     * map keys or array indexes.
     *
     * @param obj   an objec to introspect.
     * @returns a list with property names.
     */
    static getPropertyNames(obj: any): string[];
    /**
     * Get values of all properties in specified object
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
