/**
 * Helper class to perform property introspection and dynamic writing.
 *
 * It is similar to [[ObjectWriter]] but writes properties recursively
 * through the entire object graph. Nested property names are defined
 * using dot notation as "object.subobject.property"
 *
 * @see [[PropertyReflector]]
 * @see [[ObjectWriter]]
 */
export declare class RecursiveObjectWriter {
    private static createProperty;
    private static performSetProperty;
    /**
     * Recursively sets value of object and its subobjects property specified by its name.
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
     * Recursively sets values of some (all) object and its subobjects properties.
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
    /**
     * Copies content of one object to another object
     * by recursively reading all properties from source object
     * and then recursively writing them to destination object.
     *
     * @param dest 	a destination object to write properties to.
     * @param src 	a source object to read properties from
     */
    static copyProperties(dest: any, src: any): void;
}
