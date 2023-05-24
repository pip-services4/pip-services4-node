"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeSafeVariantOperations = void 0;
/** @module variants */
const Variant_1 = require("./Variant");
const VariantType_1 = require("./VariantType");
const AbstractVariantOperations_1 = require("./AbstractVariantOperations");
/**
 * Implements a strongly typed (type safe) variant operations manager object.
 */
class TypeSafeVariantOperations extends AbstractVariantOperations_1.AbstractVariantOperations {
    /**
     * Converts variant to specified type
     * @param value A variant value to be converted.
     * @param newType A type of object to be returned.
     * @returns A converted Variant value.
     */
    convert(value, newType) {
        if (newType == VariantType_1.VariantType.Null) {
            let result = new Variant_1.Variant();
            return result;
        }
        if (newType == value.type || newType == VariantType_1.VariantType.Object) {
            return value;
        }
        switch (value.type) {
            case VariantType_1.VariantType.Integer:
                return this.convertFromInteger(value, newType);
            case VariantType_1.VariantType.Long:
                return this.convertFromLong(value, newType);
            case VariantType_1.VariantType.Float:
                return this.convertFromFloat(value, newType);
            case VariantType_1.VariantType.Double:
                break;
            case VariantType_1.VariantType.String:
                break;
            case VariantType_1.VariantType.Boolean:
                break;
            case VariantType_1.VariantType.Object:
                return value;
            case VariantType_1.VariantType.Array:
                break;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type)
            + " to " + this.typeToString(newType) + " is not supported.");
    }
    convertFromInteger(value, newType) {
        let result = new Variant_1.Variant();
        switch (newType) {
            case VariantType_1.VariantType.Long:
                result.asLong = value.asInteger;
                return result;
            case VariantType_1.VariantType.Float:
                result.asFloat = value.asInteger;
                return result;
            case VariantType_1.VariantType.Double:
                result.asDouble = value.asInteger;
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type)
            + " to " + this.typeToString(newType) + " is not supported.");
    }
    convertFromLong(value, newType) {
        let result = new Variant_1.Variant();
        switch (newType) {
            case VariantType_1.VariantType.Float:
                result.asFloat = value.asLong;
                return result;
            case VariantType_1.VariantType.Double:
                result.asDouble = value.asLong;
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type)
            + " to " + this.typeToString(newType) + " is not supported.");
    }
    convertFromFloat(value, newType) {
        let result = new Variant_1.Variant();
        switch (newType) {
            case VariantType_1.VariantType.Double:
                result.asDouble = value.asFloat;
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type)
            + " to " + this.typeToString(newType) + " is not supported.");
    }
}
exports.TypeSafeVariantOperations = TypeSafeVariantOperations;
//# sourceMappingURL=TypeSafeVariantOperations.js.map