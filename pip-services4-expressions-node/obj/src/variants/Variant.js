"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variant = void 0;
/** @module variants */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const VariantType_1 = require("./VariantType");
/**
 * Defines container for variant values.
 */
class Variant {
    /**
     * Constructs this class and assignes another variant value.
     * @param value a value to be assigned to this variant.
     */
    constructor(value) {
        this.asObject = value;
    }
    /**
     * Gets a type of the variant value
     * @returns the variant value type
     */
    get type() {
        return this._type;
    }
    /**
     * Gets variant value as integer
     */
    get asInteger() {
        return this._value;
    }
    /**
     * Sets variant value as integer
     * @param value a value to be set
     */
    set asInteger(value) {
        this._type = VariantType_1.VariantType.Integer;
        this._value = value;
    }
    /**
     * Gets variant value as long
     */
    get asLong() {
        return this._value;
    }
    /**
     * Sets variant value as long
     * @param value a value to be set
     */
    set asLong(value) {
        this._type = VariantType_1.VariantType.Long;
        this._value = value;
    }
    /**
     * Gets variant value as boolean
     */
    get asBoolean() {
        return this._value;
    }
    /**
     * Sets variant value as boolean
     * @param value a value to be set
     */
    set asBoolean(value) {
        this._type = VariantType_1.VariantType.Boolean;
        this._value = value;
    }
    /**
     * Gets variant value as float
     */
    get asFloat() {
        return this._value;
    }
    /**
     * Sets variant value as float
     * @param value a value to be set
     */
    set asFloat(value) {
        this._type = VariantType_1.VariantType.Float;
        this._value = value;
    }
    /**
     * Gets variant value as double
     */
    get asDouble() {
        return this._value;
    }
    /**
     * Sets variant value as double
     * @param value a value to be set
     */
    set asDouble(value) {
        this._type = VariantType_1.VariantType.Double;
        this._value = value;
    }
    /**
     * Gets variant value as string
     */
    get asString() {
        return this._value;
    }
    /**
     * Sets variant value as string
     * @param value a value to be set
     */
    set asString(value) {
        this._type = VariantType_1.VariantType.String;
        this._value = value;
    }
    /**
     * Gets variant value as DateTime
     */
    get asDateTime() {
        return this._value;
    }
    /**
     * Sets variant value as DateTime
     * @param value a value to be set
     */
    set asDateTime(value) {
        this._type = VariantType_1.VariantType.DateTime;
        this._value = value;
    }
    /**
     * Gets variant value as TimeSpan
     */
    get asTimeSpan() {
        return this._value;
    }
    /**
     * Sets variant value as TimeSpan
     * @param value a value to be set
     */
    set asTimeSpan(value) {
        this._type = VariantType_1.VariantType.TimeSpan;
        this._value = value;
    }
    /**
     * Gets variant value as Object
     */
    get asObject() {
        return this._value;
    }
    /**
     * Sets variant value as Object
     * @param value a value to be set
     */
    set asObject(value) {
        this._value = value;
        if (value == null)
            this._type = VariantType_1.VariantType.Null;
        else if (Number.isInteger(value))
            this._type = VariantType_1.VariantType.Integer;
        else if (typeof value === "number")
            this._type = VariantType_1.VariantType.Double;
        else if (typeof value === "boolean")
            this._type = VariantType_1.VariantType.Boolean;
        else if (value instanceof Date)
            this._type = VariantType_1.VariantType.DateTime;
        else if (typeof value === "string")
            this._type = VariantType_1.VariantType.String;
        else if (Array.isArray(value)) {
            this._type = VariantType_1.VariantType.Array;
        }
        else if (value instanceof Variant) {
            this._type = value._type;
            this._value = value._value;
        }
        else {
            this._type = VariantType_1.VariantType.Object;
        }
    }
    /**
     * Gets variant value as variant array
     */
    get asArray() {
        return this._value;
    }
    /**
     * Sets variant value as variant array
     * @param value a value to be set
     */
    set asArray(value) {
        this._type = VariantType_1.VariantType.Array;
        if (value != null) {
            this._value = [...value];
        }
        else {
            this._value = null;
        }
    }
    /**
     * Gets length of the array
     * @returns The length of the array or 0
     */
    get length() {
        if (this._type == VariantType_1.VariantType.Array) {
            return Array.isArray(this._value) ? this._value.length : 0;
        }
        return 0;
    }
    /**
     * Sets a new array length
     * @param value a new array length
     */
    set length(value) {
        if (this._type == VariantType_1.VariantType.Array) {
            this._value = [...this._value];
            while (this._value.length < value) {
                this._value.push(null);
            }
        }
        else {
            throw new Error("Cannot set array length for non-array data type.");
        }
    }
    /**
     * Gets an array element by its index.
     * @param index an element index
     * @returns a requested array element
     */
    getByIndex(index) {
        if (this._type == VariantType_1.VariantType.Array) {
            if (Array.isArray(this._value) && this._value.length > index) {
                return this._value[index];
            }
            throw new Error("Requested element of array is not accessible.");
        }
        throw new Error("Cannot access array element for none-array data type.");
    }
    /**
     * Sets an array element by its index.
     * @param index an element index
     * @param element an element value
     */
    setByIndex(index, element) {
        if (this._type == VariantType_1.VariantType.Array) {
            if (Array.isArray(this._value)) {
                while (this._value.length <= index) {
                    this._value.push(null);
                }
                this._value[index] = element;
            }
            else {
                throw new Error("Requested element of array is not accessible.");
            }
        }
        else {
            throw new Error("Cannot access array element for none-array data type.");
        }
    }
    /**
     * Checks is this variant value Null.
     * @returns <code>true</code> if this variant value is Null.
     */
    isNull() {
        return this._type == VariantType_1.VariantType.Null;
    }
    /**
     * Checks is this variant value empty.
     * @returns <code>true</code< is this variant value is empty.
     */
    isEmpty() {
        return this._value == null;
    }
    /**
     * Assignes a new value to this object.
     * @param value A new value to be assigned.
     */
    assign(value) {
        if (value != null) {
            this._type = value._type;
            this._value = value._value;
        }
        else {
            this._type = VariantType_1.VariantType.Null;
            this._value = null;
        }
    }
    /**
     * Clears this object and assignes a VariantType.Null type.
     */
    clear() {
        this._type = VariantType_1.VariantType.Null;
        this._value = null;
    }
    /**
     * Returns a string value for this object.
     * @returns a string value for this object.
     */
    toString() {
        return this._value == null ? "null" : pip_services3_commons_node_1.StringConverter.toString(this._value);
    }
    /**
     * Compares this object to the specified one.
     * @param obj An object to be compared.
     * @returns <code>true</code> if objects are equal.
     */
    equals(obj) {
        if (obj instanceof Variant) {
            let varObj = obj;
            let value1 = this._value;
            let value2 = varObj._value;
            if (value1 == null || value2 == null) {
                return value1 == value2;
            }
            return (this._type == varObj._type) && (value1 == value2);
        }
        return false;
    }
    /**
     * Cloning the variant value
     * @returns The cloned value of this variant
     */
    clone() {
        return new Variant(this);
    }
    /**
     * Creates a new variant from Integer value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromInteger(value) {
        let result = new Variant();
        result.asInteger = value;
        return result;
    }
    /**
     * Creates a new variant from Long value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromLong(value) {
        let result = new Variant();
        result.asLong = value;
        return result;
    }
    /**
     * Creates a new variant from Boolean value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromBoolean(value) {
        let result = new Variant();
        result.asBoolean = value;
        return result;
    }
    /**
     * Creates a new variant from Float value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromFloat(value) {
        let result = new Variant();
        result.asFloat = value;
        return result;
    }
    /**
     * Creates a new variant from Double value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromDouble(value) {
        let result = new Variant();
        result.asDouble = value;
        return result;
    }
    /**
     * Creates a new variant from String value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromString(value) {
        let result = new Variant();
        result.asString = value;
        return result;
    }
    /**
     * Creates a new variant from DateTime value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromDateTime(value) {
        let result = new Variant();
        result.asDateTime = value;
        return result;
    }
    /**
     * Creates a new variant from TimeSpan value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromTimeSpan(value) {
        let result = new Variant();
        result.asTimeSpan = value;
        return result;
    }
    /**
     * Creates a new variant from Object value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromObject(value) {
        let result = new Variant();
        result.asObject = value;
        return result;
    }
    /**
     * Creates a new variant from Array value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromArray(value) {
        let result = new Variant();
        result.asArray = value;
        return result;
    }
}
exports.Variant = Variant;
Variant.Empty = new Variant(null);
//# sourceMappingURL=Variant.js.map