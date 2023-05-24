/**
 * Helper class to perform property introspection and dynamic writing.
 *
 * In contrast to [[PropertyReflector]] which only introspects regular objects,
 * this ObjectWriter is also able to handle maps and arrays.
 * For maps properties are key-pairs identified by string keys,
 * For arrays properties are elements identified by integer index.
 *
 * This class has symmetric implementation across all languages supported
 * by Pip.Services toolkit and used to support dynamic data processing.
 *
 * Because all languages have different casing and case sensitivity rules,
 * this ObjectWriter treats all property names as case insensitive.
 *
 * @see [[PropertyReflector]]
 *
 * ### Example ###
 *
 *     let myObj = new MyObject();
 *
 *     ObjectWriter.setProperty(myObj, "myProperty", 123);
 *
 *     let myMap = { key1: 123, key2: "ABC" };
 *     ObjectWriter.setProperty(myMap, "key1", "XYZ");
 *
 *     let myArray = [1, 2, 3]
 *     ObjectWriter.setProperty(myArray, "0", 123);
 */
export declare class ObjectWriter {
    /**
     * Sets value of object property specified by its name.
     *
     * The object can be a user defined object, map or array.
     * The property name correspondently must be object property,
     * map key or array index.
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
     * The object can be a user defined object, map or array.
     * Property values correspondently are object properties,
     * map key-pairs or array elements with their indexes.
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
