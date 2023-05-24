/** @module variants */
import { Variant } from './Variant';
import { VariantType } from './VariantType';
import { IVariantOperations } from "./IVariantOperations";

/**
 * Implements an abstractd variant operations manager object.
 */
export abstract class AbstractVariantOperations implements IVariantOperations {
    /**
     * Convert variant type to string representation
     * @param value a variant type to be converted.
     * @returns a string representation of the type.
     */
    protected typeToString(value: VariantType): string {
        switch (value) {
            case VariantType.Null:
                return "Null";
            case VariantType.Integer:
                return "Integer";
            case VariantType.Long:
                return "Long";
            case VariantType.Float:
                return "Float";
            case VariantType.Double:
                return "Double";
            case VariantType.String:
                return "String";
            case VariantType.Boolean:
                return "Boolean";
            case VariantType.DateTime:
                return "DateTime";
            case VariantType.TimeSpan:
                return "TimeSpan";
            case VariantType.Object:
                return "Object";
            case VariantType.Array:
                return "Array";
            default:
                return "Unknown";
        }
    }

    /**
     * Converts variant to specified type
     * @param value A variant value to be converted.
     * @param newType A type of object to be returned.
     * @returns A converted Variant value.
     */
    public abstract convert(value: Variant, newType: VariantType): Variant;

    /**
     * Performs '+' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
     public add(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
                result.asInteger = value1.asInteger + value2.asInteger;
                return result;
            case VariantType.Long:
                result.asLong = value1.asLong + value2.asLong;
                return result;
            case VariantType.Float:
                result.asFloat = value1.asFloat + value2.asFloat;
                return result;
            case VariantType.Double:
                result.asDouble = value1.asDouble + value2.asDouble;
                return result;
            case VariantType.TimeSpan:
                result.asTimeSpan = value1.asTimeSpan + value2.asTimeSpan;
                return result;
            case VariantType.String:
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
    public sub(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
                result.asInteger = value1.asInteger - value2.asInteger;
                return result;
            case VariantType.Long:
                result.asLong = value1.asLong - value2.asLong;
                return result;
            case VariantType.Float:
                result.asFloat = value1.asFloat - value2.asFloat;
                return result;
            case VariantType.Double:
                result.asDouble = value1.asDouble - value2.asDouble;
                return result;
            case VariantType.TimeSpan:
                result.asTimeSpan = value1.asTimeSpan - value2.asTimeSpan;
                return result;
            case VariantType.DateTime:
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
    public mul(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
                result.asInteger = value1.asInteger * value2.asInteger;
                return result;
            case VariantType.Long:
                result.asLong = value1.asLong * value2.asLong;
                return result;
            case VariantType.Float:
                result.asFloat = value1.asFloat * value2.asFloat;
                return result;
            case VariantType.Double:
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
    public div(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
                result.asInteger = value1.asInteger / value2.asInteger;
                return result;
            case VariantType.Long:
                result.asLong = value1.asLong / value2.asLong;
                return result;
            case VariantType.Float:
                result.asFloat = value1.asFloat / value2.asFloat;
                return result;
            case VariantType.Double:
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
    public mod(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
                result.asInteger = value1.asInteger % value2.asInteger;
                return result;
            case VariantType.Long:
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
    public pow(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
            case VariantType.Long:
            case VariantType.Float:
            case VariantType.Double:
                // Converts second operant to the type of the first operand.
                value1 = this.convert(value1, VariantType.Double);
                value2 = this.convert(value2, VariantType.Double);
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
    public and(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
                result.asInteger = value1.asInteger & value2.asInteger;
                return result;
            case VariantType.Long:
                result.asLong = value1.asLong & value2.asLong;
                return result;
            case VariantType.Boolean:
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
    public or(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
                result.asInteger = value1.asInteger | value2.asInteger;
                return result;
            case VariantType.Long:
                result.asLong = value1.asLong | value2.asLong;
                return result;
            case VariantType.Boolean:
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
    public xor(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
                result.asInteger = value1.asInteger ^ value2.asInteger;
                return result;
            case VariantType.Long:
                result.asLong = value1.asLong ^ value2.asLong;
                return result;
            case VariantType.Boolean:
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
    public lsh(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, VariantType.Integer);

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
                result.asInteger = value1.asInteger << value2.asInteger;
                return result;
            case VariantType.Long:
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
    public rsh(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, VariantType.Integer);

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
                result.asInteger = value1.asInteger >> value2.asInteger;
                return result;
            case VariantType.Long:
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
    public not(value: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value.type == VariantType.Null) {
            return result;
        }

        // Performs operation.
        switch (value.type) {
            case VariantType.Integer:
                result.asInteger = ~value.asInteger;
                return result;
            case VariantType.Long:
                result.asLong = ~value.asLong;
                return result;
            case VariantType.Boolean:
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
    public negative(value: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value.type == VariantType.Null) {
            return result;
        }

        // Performs operation.
        switch (value.type) {
            case VariantType.Integer:
                result.asInteger = -value.asInteger;
                return result;
            case VariantType.Long:
                result.asLong = -value.asLong;
                return result;
            case VariantType.Float:
                result.asFloat = -value.asFloat;
                return result;
            case VariantType.Double:
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
    public equal(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null && value2.type == VariantType.Null) {
            result.asBoolean = true;
            return result;
        }
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            result.asBoolean = false;
            return result;
        }

        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
                result.asBoolean = value1.asInteger == value2.asInteger;
                return result;
            case VariantType.Long:
                result.asBoolean = value1.asLong == value2.asLong;
                return result;
            case VariantType.Float:
                result.asBoolean = value1.asFloat == value2.asFloat;
                return result;
            case VariantType.Double:
                result.asBoolean = value1.asDouble == value2.asDouble;
                return result;
            case VariantType.String:
                result.asBoolean = value1.asString == value2.asString;
                return result;
            case VariantType.TimeSpan:
                result.asBoolean = value1.asTimeSpan == value2.asTimeSpan;
                return result;
            case VariantType.DateTime:
                result.asBoolean = value1.asDateTime.getTime() == value2.asDateTime.getTime();
                return result;
            case VariantType.Boolean:
                result.asBoolean = value1.asBoolean == value2.asBoolean;
                return result;
            case VariantType.Object:
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
    public notEqual(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null && value2.type == VariantType.Null) {
            result.asBoolean = false;
            return result;
        }
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            result.asBoolean = true;
            return result;
        }

        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
                result.asBoolean = value1.asInteger != value2.asInteger;
                return result;
            case VariantType.Long:
                result.asBoolean = value1.asLong != value2.asLong;
                return result;
            case VariantType.Float:
                result.asBoolean = value1.asFloat != value2.asFloat;
                return result;
            case VariantType.Double:
                result.asBoolean = value1.asDouble != value2.asDouble;
                return result;
            case VariantType.String:
                result.asBoolean = value1.asString != value2.asString;
                return result;
            case VariantType.TimeSpan:
                result.asBoolean = value1.asTimeSpan != value2.asTimeSpan;
                return result;
            case VariantType.DateTime:
                result.asBoolean = value1.asDateTime.getTime() != value2.asDateTime.getTime();
                return result;
            case VariantType.Boolean:
                result.asBoolean = value1.asBoolean != value2.asBoolean;
                return result;
            case VariantType.Object:
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
    public more(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
                result.asBoolean = value1.asInteger > value2.asInteger;
                return result;
            case VariantType.Long:
                result.asBoolean = value1.asLong > value2.asLong;
                return result;
            case VariantType.Float:
                result.asBoolean = value1.asFloat > value2.asFloat;
                return result;
            case VariantType.Double:
                result.asBoolean = value1.asDouble > value2.asDouble;
                return result;
            case VariantType.String:
                result.asBoolean = value1.asString > value2.asString;
                return result;
            case VariantType.TimeSpan:
                result.asBoolean = value1.asTimeSpan > value2.asTimeSpan;
                return result;
            case VariantType.DateTime:
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
    public less(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
                result.asBoolean = value1.asInteger < value2.asInteger;
                return result;
            case VariantType.Long:
                result.asBoolean = value1.asLong < value2.asLong;
                return result;
            case VariantType.Float:
                result.asBoolean = value1.asFloat < value2.asFloat;
                return result;
            case VariantType.Double:
                result.asBoolean = value1.asDouble < value2.asDouble;
                return result;
            case VariantType.String:
                result.asBoolean = value1.asString < value2.asString;
                return result;
            case VariantType.TimeSpan:
                result.asBoolean = value1.asTimeSpan < value2.asTimeSpan;
                return result;
            case VariantType.DateTime:
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
    public moreEqual(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
                result.asBoolean = value1.asInteger >= value2.asInteger;
                return result;
            case VariantType.Long:
                result.asBoolean = value1.asLong >= value2.asLong;
                return result;
            case VariantType.Float:
                result.asBoolean = value1.asFloat >= value2.asFloat;
                return result;
            case VariantType.Double:
                result.asBoolean = value1.asDouble >= value2.asDouble;
                return result;
            case VariantType.String:
                result.asBoolean = value1.asString >= value2.asString;
                return result;
            case VariantType.TimeSpan:
                result.asBoolean = value1.asTimeSpan >= value2.asTimeSpan;
                return result;
            case VariantType.DateTime:
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
    public lessEqual(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        // Converts second operant to the type of the first operand.
        value2 = this.convert(value2, value1.type);

        // Performs operation.
        switch (value1.type) {
            case VariantType.Integer:
                result.asBoolean = value1.asInteger <= value2.asInteger;
                return result;
            case VariantType.Long:
                result.asBoolean = value1.asLong <= value2.asLong;
                return result;
            case VariantType.Float:
                result.asBoolean = value1.asFloat <= value2.asFloat;
                return result;
            case VariantType.Double:
                result.asBoolean = value1.asDouble <= value2.asDouble;
                return result;
            case VariantType.String:
                result.asBoolean = value1.asString <= value2.asString;
                return result;
            case VariantType.TimeSpan:
                result.asBoolean = value1.asTimeSpan <= value2.asTimeSpan;
                return result;
            case VariantType.DateTime:
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
    public in(value1: Variant, value2: Variant): Variant {        
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        // Processes null arrays.
        if (value1.asObject == null) {
            result.asBoolean = false;
            return result;
        }

        if (value1.type == VariantType.Array) {
            let array = value1.asArray;
            for (let element of array) {
                let eq = this.equal(value2, element);
                if (eq.type == VariantType.Boolean && eq.asBoolean) {
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
    public getElement(value1: Variant, value2: Variant): Variant {
        let result = new Variant();

        // Processes VariantType.Null values.
        if (value1.type == VariantType.Null || value2.type == VariantType.Null) {
            return result;
        }

        value2 = this.convert(value2, VariantType.Integer);

        if (value1.type == VariantType.Array) {
            return value1.getByIndex(value2.asInteger);
        } else if (value1.type == VariantType.String) {
            result.asString = value1.asString.charAt(value2.asInteger);
            return result;
        }
        throw new Error("Operation '[]' is not supported for type " + this.typeToString(value1.type));
    }
}
