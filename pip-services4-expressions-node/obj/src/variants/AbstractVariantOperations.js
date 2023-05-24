"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractVariantOperations = void 0;
/** @module variants */
const Variant_1 = require("./Variant");
const VariantType_1 = require("./VariantType");
/**
 * Implements an abstractd variant operations manager object.
 */
class AbstractVariantOperations {
    /**
     * Convert variant type to string representation
     * @param value a variant type to be converted.
     * @returns a string representation of the type.
     */
    typeToString(value) {
        switch (value) {
            case VariantType_1.VariantType.Null:
                return "Null";
            case VariantType_1.VariantType.Integer:
                return "Integer";
            case VariantType_1.VariantType.Long:
                return "Long";
            case VariantType_1.VariantType.Float:
                return "Float";
            case VariantType_1.VariantType.Double:
                return "Double";
            case VariantType_1.VariantType.String:
                return "String";
            case VariantType_1.VariantType.Boolean:
                return "Boolean";
            case VariantType_1.VariantType.DateTime:
                return "DateTime";
            case VariantType_1.VariantType.TimeSpan:
                return "TimeSpan";
            case VariantType_1.VariantType.Object:
                return "Object";
            case VariantType_1.VariantType.Array:
                return "Array";
            default:
                return "Unknown";
        }
    }
    /**
     * Performs '+' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    add(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = value1.asInteger + value2.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = value1.asLong + value2.asLong;
                return result;
            case VariantType_1.VariantType.Float:
                result.asFloat = value1.asFloat + value2.asFloat;
                return result;
            case VariantType_1.VariantType.Double:
                result.asDouble = value1.asDouble + value2.asDouble;
                return result;
            case VariantType_1.VariantType.TimeSpan:
                result.asTimeSpan = value1.asTimeSpan + value2.asTimeSpan;
                return result;
            case VariantType_1.VariantType.String:
                result.asString = value1.asString + value2.asString;
                return result;
        }
        throw new Error("Operation '+' is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs '-' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    sub(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = value1.asInteger - value2.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = value1.asLong - value2.asLong;
                return result;
            case VariantType_1.VariantType.Float:
                result.asFloat = value1.asFloat - value2.asFloat;
                return result;
            case VariantType_1.VariantType.Double:
                result.asDouble = value1.asDouble - value2.asDouble;
                return result;
            case VariantType_1.VariantType.TimeSpan:
                result.asTimeSpan = value1.asTimeSpan - value2.asTimeSpan;
                return result;
            case VariantType_1.VariantType.DateTime:
                result.asTimeSpan = value1.asDateTime.getTime() - value2.asDateTime.getTime();
                return result;
        }
        throw new Error("Operation '-' is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs '*' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    mul(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = value1.asInteger * value2.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = value1.asLong * value2.asLong;
                return result;
            case VariantType_1.VariantType.Float:
                result.asFloat = value1.asFloat * value2.asFloat;
                return result;
            case VariantType_1.VariantType.Double:
                result.asDouble = value1.asDouble * value2.asDouble;
                return result;
        }
        throw new Error("Operation '*' is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs '/' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    div(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = value1.asInteger / value2.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = value1.asLong / value2.asLong;
                return result;
            case VariantType_1.VariantType.Float:
                result.asFloat = value1.asFloat / value2.asFloat;
                return result;
            case VariantType_1.VariantType.Double:
                result.asDouble = value1.asDouble / value2.asDouble;
                return result;
        }
        throw new Error("Operation '/' is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs '%' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    mod(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = value1.asInteger % value2.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = value1.asLong % value2.asLong;
                return result;
        }
        throw new Error("Operation '%' is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs '^' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    pow(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
            case VariantType_1.VariantType.Long:
            case VariantType_1.VariantType.Float:
            case VariantType_1.VariantType.Double:
                // Converts second operant to the type of the first operand.
                value1 = this.convert(value1, VariantType_1.VariantType.Double);
                value2 = this.convert(value2, VariantType_1.VariantType.Double);
                result.asDouble = value1.asDouble * value2.asDouble;
                return result;
        }
        throw new Error("Operation '^' is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs AND operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    and(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = value1.asInteger & value2.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = value1.asLong & value2.asLong;
                return result;
            case VariantType_1.VariantType.Boolean:
                result.asBoolean = value1.asBoolean && value2.asBoolean;
                return result;
        }
        throw new Error("Operation AND is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs OR operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    or(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = value1.asInteger | value2.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = value1.asLong | value2.asLong;
                return result;
            case VariantType_1.VariantType.Boolean:
                result.asBoolean = value1.asBoolean || value2.asBoolean;
                return result;
        }
        throw new Error("Operation OR is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs XOR operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    xor(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = value1.asInteger ^ value2.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = value1.asLong ^ value2.asLong;
                return result;
            case VariantType_1.VariantType.Boolean:
                result.asBoolean = (value1.asBoolean && !value2.asBoolean) || (!value1.asBoolean && value2.asBoolean);
                return result;
        }
        throw new Error("Operation XOR is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs '<<' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    lsh(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, VariantType_1.VariantType.Integer);
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = value1.asInteger << value2.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = value1.asLong << value2.asInteger;
                return result;
        }
        throw new Error("Operation '<<' is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs '>>' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    rsh(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, VariantType_1.VariantType.Integer);
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = value1.asInteger >> value2.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = value1.asLong >> value2.asInteger;
                return result;
        }
        throw new Error("Operation '>>' is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs NOT operation for a variant.
     * @param value The operand for this operation.
     * @returns A result variant object.
     */
    not(value) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Performs operation.
        switch (value.type) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = ~value.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = ~value.asLong;
                return result;
            case VariantType_1.VariantType.Boolean:
                result.asBoolean = !value.asBoolean;
                return result;
        }
        throw new Error("Operation NOT is not supported for type " + this.typeToString(value.type));
    }
    /**
     * Performs unary '-' operation for a variant.
     * @param value The operand for this operation.
     * @returns A result variant object.
     */
    negative(value) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Performs operation.
        switch (value.type) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = -value.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = -value.asLong;
                return result;
            case VariantType_1.VariantType.Float:
                result.asFloat = -value.asFloat;
                return result;
            case VariantType_1.VariantType.Double:
                result.asDouble = -value.asDouble;
                return result;
        }
        throw new Error("Operation unary '-' is not supported for type " + this.typeToString(value.type));
    }
    /**
     * Performs '=' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    equal(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null && value2.type == VariantType_1.VariantType.Null) {
            result.asBoolean = true;
            return result;
        }
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            result.asBoolean = false;
            return result;
        }
        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
                result.asBoolean = value1.asInteger == value2.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asBoolean = value1.asLong == value2.asLong;
                return result;
            case VariantType_1.VariantType.Float:
                result.asBoolean = value1.asFloat == value2.asFloat;
                return result;
            case VariantType_1.VariantType.Double:
                result.asBoolean = value1.asDouble == value2.asDouble;
                return result;
            case VariantType_1.VariantType.String:
                result.asBoolean = value1.asString == value2.asString;
                return result;
            case VariantType_1.VariantType.TimeSpan:
                result.asBoolean = value1.asTimeSpan == value2.asTimeSpan;
                return result;
            case VariantType_1.VariantType.DateTime:
                result.asBoolean = value1.asDateTime.getTime() == value2.asDateTime.getTime();
                return result;
            case VariantType_1.VariantType.Boolean:
                result.asBoolean = value1.asBoolean == value2.asBoolean;
                return result;
            case VariantType_1.VariantType.Object:
                result.asObject = value1.asObject == value2.asObject;
                return result;
        }
        throw new Error("Operation '=' is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs '<>' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    notEqual(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null && value2.type == VariantType_1.VariantType.Null) {
            result.asBoolean = false;
            return result;
        }
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            result.asBoolean = true;
            return result;
        }
        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
                result.asBoolean = value1.asInteger != value2.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asBoolean = value1.asLong != value2.asLong;
                return result;
            case VariantType_1.VariantType.Float:
                result.asBoolean = value1.asFloat != value2.asFloat;
                return result;
            case VariantType_1.VariantType.Double:
                result.asBoolean = value1.asDouble != value2.asDouble;
                return result;
            case VariantType_1.VariantType.String:
                result.asBoolean = value1.asString != value2.asString;
                return result;
            case VariantType_1.VariantType.TimeSpan:
                result.asBoolean = value1.asTimeSpan != value2.asTimeSpan;
                return result;
            case VariantType_1.VariantType.DateTime:
                result.asBoolean = value1.asDateTime.getTime() != value2.asDateTime.getTime();
                return result;
            case VariantType_1.VariantType.Boolean:
                result.asBoolean = value1.asBoolean != value2.asBoolean;
                return result;
            case VariantType_1.VariantType.Object:
                result.asObject = value1.asObject != value2.asObject;
                return result;
        }
        throw new Error("Operation '<>' is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs '>' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    more(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
                result.asBoolean = value1.asInteger > value2.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asBoolean = value1.asLong > value2.asLong;
                return result;
            case VariantType_1.VariantType.Float:
                result.asBoolean = value1.asFloat > value2.asFloat;
                return result;
            case VariantType_1.VariantType.Double:
                result.asBoolean = value1.asDouble > value2.asDouble;
                return result;
            case VariantType_1.VariantType.String:
                result.asBoolean = value1.asString > value2.asString;
                return result;
            case VariantType_1.VariantType.TimeSpan:
                result.asBoolean = value1.asTimeSpan > value2.asTimeSpan;
                return result;
            case VariantType_1.VariantType.DateTime:
                result.asBoolean = value1.asDateTime.getTime() > value2.asDateTime.getTime();
                return result;
        }
        throw new Error("Operation '>' is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs '<' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    less(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
                result.asBoolean = value1.asInteger < value2.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asBoolean = value1.asLong < value2.asLong;
                return result;
            case VariantType_1.VariantType.Float:
                result.asBoolean = value1.asFloat < value2.asFloat;
                return result;
            case VariantType_1.VariantType.Double:
                result.asBoolean = value1.asDouble < value2.asDouble;
                return result;
            case VariantType_1.VariantType.String:
                result.asBoolean = value1.asString < value2.asString;
                return result;
            case VariantType_1.VariantType.TimeSpan:
                result.asBoolean = value1.asTimeSpan < value2.asTimeSpan;
                return result;
            case VariantType_1.VariantType.DateTime:
                result.asBoolean = value1.asDateTime.getTime() < value2.asDateTime.getTime();
                return result;
        }
        throw new Error("Operation '<' is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs '>=' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    moreEqual(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
                result.asBoolean = value1.asInteger >= value2.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asBoolean = value1.asLong >= value2.asLong;
                return result;
            case VariantType_1.VariantType.Float:
                result.asBoolean = value1.asFloat >= value2.asFloat;
                return result;
            case VariantType_1.VariantType.Double:
                result.asBoolean = value1.asDouble >= value2.asDouble;
                return result;
            case VariantType_1.VariantType.String:
                result.asBoolean = value1.asString >= value2.asString;
                return result;
            case VariantType_1.VariantType.TimeSpan:
                result.asBoolean = value1.asTimeSpan >= value2.asTimeSpan;
                return result;
            case VariantType_1.VariantType.DateTime:
                result.asBoolean = value1.asDateTime.getTime() >= value2.asDateTime.getTime();
                return result;
        }
        throw new Error("Operation '>=' is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs '<=' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    lessEqual(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);
        // Performs operation.
        switch (value1.type) {
            case VariantType_1.VariantType.Integer:
                result.asBoolean = value1.asInteger <= value2.asInteger;
                return result;
            case VariantType_1.VariantType.Long:
                result.asBoolean = value1.asLong <= value2.asLong;
                return result;
            case VariantType_1.VariantType.Float:
                result.asBoolean = value1.asFloat <= value2.asFloat;
                return result;
            case VariantType_1.VariantType.Double:
                result.asBoolean = value1.asDouble <= value2.asDouble;
                return result;
            case VariantType_1.VariantType.String:
                result.asBoolean = value1.asString <= value2.asString;
                return result;
            case VariantType_1.VariantType.TimeSpan:
                result.asBoolean = value1.asTimeSpan <= value2.asTimeSpan;
                return result;
            case VariantType_1.VariantType.DateTime:
                result.asBoolean = value1.asDateTime.getTime() <= value2.asDateTime.getTime();
                return result;
        }
        throw new Error("Operation '<=' is not supported for type " + this.typeToString(value1.type));
    }
    /**
     * Performs IN operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    in(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        // Processes null arrays.
        if (value1.asObject == null) {
            result.asBoolean = false;
            return result;
        }
        if (value1.type == VariantType_1.VariantType.Array) {
            let array = value1.asArray;
            for (let element of array) {
                let eq = this.equal(value2, element);
                if (eq.type == VariantType_1.VariantType.Boolean && eq.asBoolean) {
                    result.asBoolean = true;
                    return result;
                }
            }
            result.asBoolean = false;
            return result;
        }
        return this.equal(value1, value2);
    }
    /**
     * Performs [] operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    getElement(value1, value2) {
        let result = new Variant_1.Variant();
        // Processes VariantType.Null values.
        if (value1.type == VariantType_1.VariantType.Null || value2.type == VariantType_1.VariantType.Null) {
            return result;
        }
        value2 = this.convert(value2, VariantType_1.VariantType.Integer);
        if (value1.type == VariantType_1.VariantType.Array) {
            return value1.getByIndex(value2.asInteger);
        }
        else if (value1.type == VariantType_1.VariantType.String) {
            result.asString = value1.asString.charAt(value2.asInteger);
            return result;
        }
        throw new Error("Operation '[]' is not supported for type " + this.typeToString(value1.type));
    }
}
exports.AbstractVariantOperations = AbstractVariantOperations;
//# sourceMappingURL=AbstractVariantOperations.js.map