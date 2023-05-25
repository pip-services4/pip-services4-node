"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Descriptor = void 0;
/** @module refer */
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
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
class Descriptor {
    /**
     * Creates a new instance of the descriptor.
     *
     * @param group 	a logical component group
     * @param type 		a logical component type or contract
     * @param kind 		a component implementation type
     * @param name		a unique component name
     * @param version 	a component implementation version
     */
    constructor(group, type, kind, name, version) {
        if ("*" == group)
            group = null;
        if ("*" == type)
            type = null;
        if ("*" == kind)
            kind = null;
        if ("*" == name)
            name = null;
        if ("*" == version)
            version = null;
        this._group = group;
        this._type = type;
        this._kind = kind;
        this._name = name;
        this._version = version;
    }
    /**
     * Gets the component's logical group.
     *
     * @returns the component's logical group
     */
    getGroup() {
        return this._group;
    }
    /**
     * Gets the component's logical type.
     *
     * @returns the component's logical type.
     */
    getType() {
        return this._type;
    }
    /**
     * Gets the component's implementation type.
     *
     * @returns the component's implementation type.
     */
    getKind() {
        return this._kind;
    }
    /**
     * Gets the unique component's name.
     *
     * @returns the unique component's name.
     */
    getName() {
        return this._name;
    }
    /**
     * Gets the component's implementation version.
     *
     * @returns the component's implementation version.
     */
    getVersion() {
        return this._version;
    }
    matchField(field1, field2) {
        return field1 == null
            || field2 == null
            || field1 == field2;
    }
    /**
     * Partially matches this descriptor to another descriptor.
     * Fields that contain "*" or null are excluded from the match.
     *
     * @param descriptor 	the descriptor to match this one against.
     * @returns true if descriptors match and false otherwise
     *
     * @see [[exactMatch]]
     */
    match(descriptor) {
        return this.matchField(this._group, descriptor.getGroup())
            && this.matchField(this._type, descriptor.getType())
            && this.matchField(this._kind, descriptor.getKind())
            && this.matchField(this._name, descriptor.getName())
            && this.matchField(this._version, descriptor.getVersion());
    }
    exactMatchField(field1, field2) {
        if (field1 == null && field2 == null)
            return true;
        if (field1 == null || field2 == null)
            return false;
        return field1 == field2;
    }
    /**
     * Matches this descriptor to another descriptor by all fields.
     * No exceptions are made.
     *
     * @param descriptor 	the descriptor to match this one against.
     * @returns true if descriptors match and false otherwise.
     *
     * @see [[match]]
     */
    exactMatch(descriptor) {
        return this.exactMatchField(this._group, descriptor.getGroup())
            && this.exactMatchField(this._type, descriptor.getType())
            && this.exactMatchField(this._kind, descriptor.getKind())
            && this.exactMatchField(this._name, descriptor.getName())
            && this.exactMatchField(this._version, descriptor.getVersion());
    }
    /**
     * Checks whether all descriptor fields are set.
     * If descriptor has at least one "*" or null field it is considered "incomplete",
     *
     * @returns true if all descriptor fields are defined and false otherwise.
     */
    isComplete() {
        return this._group != null && this._type != null && this._kind != null
            && this._name != null && this._version != null;
    }
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
    equals(value) {
        if (typeof value === "object" && value.constructor.name === "Descriptor") {
            return this.match(value);
        }
        return false;
    }
    /**
     * Gets a string representation of the object.
     * The result is a colon-separated list of descriptor fields as
     * "mygroup:connector:aws:default:1.0"
     *
     * @returns a string representation of the object.
     */
    toString() {
        return (this._group || "*")
            + ":" + (this._type || "*")
            + ":" + (this._kind || "*")
            + ":" + (this._name || "*")
            + ":" + (this._version || "*");
    }
    /**
     * Parses colon-separated list of descriptor fields and returns them as a Descriptor.
     *
     * @param value      colon-separated descriptor fields to initialize Descriptor.
     * @returns         a newly created Descriptor.
     * @throws a [[ConfigException]] if the descriptor string is of a wrong format.
     */
    static fromString(value) {
        if (value == null || value.length == 0) {
            return null;
        }
        let tokens = value.split(":");
        if (tokens.length != 5) {
            throw new pip_services4_commons_node_1.ConfigException(null, "BAD_DESCRIPTOR", "Descriptor " + value + " is in wrong format").withDetails("descriptor", value);
        }
        return new Descriptor(tokens[0].trim(), tokens[1].trim(), tokens[2].trim(), tokens[3].trim(), tokens[4].trim());
    }
}
exports.Descriptor = Descriptor;
//# sourceMappingURL=Descriptor.js.map