/**
 * Locator type that most often used in PipServices toolkit.
 * It locates components using several fields:
 * - Group: a package or just named group of components like "pip-services"
 * - Type: logical component type that defines it's contract like "persistence"
 * - Kind: physical implementation type like "mongodb"
 * - Name: unique component name like "default"
 * - Version: version of the component contract like "1.0"
 *
 * The locator matching can be done by all or only few selected fields.
 * The fields that shall be excluded from the matching must be set to <code>"*"</code> or <code>null</code>.
 * That approach allows to implement many interesting scenarios. For instance:
 * - Locate all loggers (match by type and version)
 * - Locate persistence components for a microservice (match by group and type)
 * - Locate specific component by its name (match by name)
 *
 * ### Example ###
 *
 *     let locator1 = new Descriptor("mygroup", "connector", "aws", "default", "1.0");
 *     let locator2 = Descriptor.fromString("mygroup:connector:*:*:1.0");
 *
 *     locator1.match(locator2);		// Result: true
 *     locator1.equal(locator2);		// Result: true
 *     locator1.exactMatch(locator2);	// Result: false
 */
export declare class Descriptor {
    private _group;
    private _type;
    private _kind;
    private _name;
    private _version;
    /**
     * Creates a new instance of the descriptor.
     *
     * @param group 	a logical component group
     * @param type 		a logical component type or contract
     * @param kind 		a component implementation type
     * @param name		a unique component name
     * @param version 	a component implementation version
     */
    constructor(group: string, type: string, kind: string, name: string, version: string);
    /**
     * Gets the component's logical group.
     *
     * @returns the component's logical group
     */
    getGroup(): string;
    /**
     * Gets the component's logical type.
     *
     * @returns the component's logical type.
     */
    getType(): string;
    /**
     * Gets the component's implementation type.
     *
     * @returns the component's implementation type.
     */
    getKind(): string;
    /**
     * Gets the unique component's name.
     *
     * @returns the unique component's name.
     */
    getName(): string;
    /**
     * Gets the component's implementation version.
     *
     * @returns the component's implementation version.
     */
    getVersion(): string;
    private matchField;
    /**
     * Partially matches this descriptor to another descriptor.
     * Fields that contain "*" or null are excluded from the match.
     *
     * @param descriptor 	the descriptor to match this one against.
     * @returns true if descriptors match and false otherwise
     *
     * @see [[exactMatch]]
     */
    match(descriptor: Descriptor): boolean;
    private exactMatchField;
    /**
     * Matches this descriptor to another descriptor by all fields.
     * No exceptions are made.
     *
     * @param descriptor 	the descriptor to match this one against.
     * @returns true if descriptors match and false otherwise.
     *
     * @see [[match]]
     */
    exactMatch(descriptor: Descriptor): boolean;
    /**
     * Checks whether all descriptor fields are set.
     * If descriptor has at least one "*" or null field it is considered "incomplete",
     *
     * @returns true if all descriptor fields are defined and false otherwise.
     */
    isComplete(): boolean;
    /**
     * Compares this descriptor to a value.
     * If value is a Descriptor it tries to match them,
     * otherwise the method returns false.
     *
     * @param value 	the value to match against this descriptor.
     * @returns true if the value is matching descriptor and false otherwise.
     *
     * @see [[match]]
     */
    equals(value: any): boolean;
    /**
     * Gets a string representation of the object.
     * The result is a colon-separated list of descriptor fields as
     * "mygroup:connector:aws:default:1.0"
     *
     * @returns a string representation of the object.
     */
    toString(): string;
    /**
     * Parses colon-separated list of descriptor fields and returns them as a Descriptor.
     *
     * @param value      colon-separated descriptor fields to initialize Descriptor.
     * @returns         a newly created Descriptor.
     * @throws a [[ConfigException]] if the descriptor string is of a wrong format.
     */
    static fromString(value: String): Descriptor;
}
