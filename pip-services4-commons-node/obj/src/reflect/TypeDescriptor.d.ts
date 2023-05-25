/**
 * Descriptor that points to specific object type by it's name
 * and optional library (or module) where this type is defined.
 *
 * This class has symmetric implementation across all languages supported
 * by Pip.Services toolkit and used to support dynamic data processing.
 */
export declare class TypeDescriptor {
    private _name;
    private _library;
    /**
     * Creates a new instance of the type descriptor and sets its values.
     *
     * @param name 		a name of the object type.
     * @param library 	a library or module where this object type is implemented.
     */
    constructor(name: string, library: string);
    /**
     * Get the name of the object type.
     *
     * @returns the name of the object type.
     */
    getName(): string;
    /**
     * Gets the name of the library or module where the object type is defined.
     *
     * @returns the name of the library or module.
     */
    getLibrary(): string;
    /**
     * Compares this descriptor to a value.
     * If the value is also a TypeDescriptor it compares their name and library fields.
     * Otherwise this method returns false.
     *
     * @param value		a value to compare.
     * @returns true if value is identical TypeDescriptor and false otherwise.
     */
    equals(value: any): boolean;
    /**
     * Gets a string representation of the object.
     * The result has format name[,library]
     *
     * @returns a string representation of the object.
     *
     * @see [[fromString]]
     */
    toString(): string;
    /**
     * Parses a string to get descriptor fields and returns them as a Descriptor.
     * The string must have format name[,library]
     *
     * @param value     a string to parse.
     * @returns         a newly created Descriptor.
     * @throws a [[ConfigException]] if the descriptor string is of a wrong format.
     *
     * @see [[toString]]
     */
    static fromString(value: string): TypeDescriptor;
}
