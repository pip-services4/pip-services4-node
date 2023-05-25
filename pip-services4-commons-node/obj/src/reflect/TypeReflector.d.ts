import { TypeDescriptor } from './TypeDescriptor';
/**
 * Helper class to perform object type introspection and object instantiation.
 *
 * This class has symmetric implementation across all languages supported
 * by Pip.Services toolkit and used to support dynamic data processing.
 *
 * Because all languages have different casing and case sensitivity rules,
 * this TypeReflector treats all type names as case insensitive.
 *
 * @see [[TypeDescriptor]]
 *
 * ### Example ###
 *
 *     let descriptor = new TypeDescriptor("MyObject", "mylibrary");
 *     Typeeflector.getTypeByDescriptor(descriptor);
 *     let myObj = TypeReflector.createInstanceByDescriptor(descriptor);
 *
 *     TypeDescriptor.isPrimitive(myObject); 		// Result: false
 *     TypeDescriptor.isPrimitive(123);				// Result: true
 */
export declare class TypeReflector {
    /**
     * Gets object type by its name and library where it is defined.
     *
     * @param name 		an object type name.
     * @param library 	a library where the type is defined
     * @returns the object type or null is the type wasn't found.
     */
    static getType(name: string, library: string): any;
    /**
     * Gets object type by type descriptor.
     *
     * @param descriptor 	a type descriptor that points to an object type
     * @returns the object type or null is the type wasn't found.
     *
     * @see [[getType]]
     * @see [[TypeDescriptor]]
     */
    static getTypeByDescriptor(descriptor: TypeDescriptor): any;
    /**
     * Creates an instance of an object type.
     *
     * @param type 		an object type (factory function) to create.
     * @param args		arguments for the object constructor.
     * @returns the created object instance.
     */
    static createInstanceByType(type: any, ...args: any[]): any;
    /**
     * Creates an instance of an object type specified by its name
     * and library where it is defined.
     *
     * @param name 		an object type name.
     * @param library 	a library (module) where object type is defined.
     * @param args		arguments for the object constructor.
     * @returns the created object instance.
     *
     * @see [[getType]]
     * @see [[createInstanceByType]]
     */
    static createInstance(name: string, library: string, ...args: any[]): any;
    /**
     * Creates an instance of an object type specified by type descriptor.
     *
     * @param descriptor 	a type descriptor that points to an object type
     * @param args		arguments for the object constructor.
     * @returns the created object instance.
     *
     * @see [[createInstance]]
     * @see [[TypeDescriptor]]
     */
    static createInstanceByDescriptor(descriptor: TypeDescriptor, ...args: any[]): any;
    /**
     * Checks if value has primitive type.
     *
     * Primitive types are: numbers, strings, booleans, date and time.
     * Complex (non-primitive types are): objects, maps and arrays
     *
     * @param value 	a value to check
     * @returns true if the value has primitive type and false if value type is complex.
     *
     * @see [[TypeConverter.toTypeCode]]
     * @see [[TypeCode]]
     */
    static isPrimitive(value: any): boolean;
}
