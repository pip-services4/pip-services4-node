"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeMatcher = void 0;
/** @module reflect */
const TypeCode_1 = require("../convert/TypeCode");
const TypeConverter_1 = require("../convert/TypeConverter");
const convert_1 = require("../convert");
/**
 * Helper class matches value types for equality.
 *
 * This class has symmetric implementation across all languages supported
 * by Pip.Services toolkit and used to support dynamic data processing.
 *
 * @see [[TypeCode]]
 */
class TypeMatcher {
    /**
     * Matches expected type to a type of a value.
     * The expected type can be specified by a type, type name or [[TypeCode]].
     *
     * @param expectedType      an expected type to match.
     * @param actualValue       a value to match its type to the expected one.
     * @returns true if types are matching and false if they don't.
     *
     * @see [[matchType]]
     * @see [[matchValueTypeByName]] (for matching by types' string names)
     */
    static matchValueType(expectedType, actualValue) {
        if (expectedType == null) {
            return true;
        }
        if (actualValue == null) {
            throw new Error("Actual value cannot be null");
        }
        return TypeMatcher.matchType(expectedType, TypeConverter_1.TypeConverter.toTypeCode(actualValue));
    }
    /**
     * Matches expected type to an actual type.
     * The types can be specified as types, type names or [[TypeCode]].
     *
     * @param expectedType  an expected type to match.
     * @param actualType    an actual type to match.
     * @param actualValue   an optional value to match its type to the expected one.
     * @returns true if types are matching and false if they don't.
     *
     * @see [[matchTypeByName]]
     * @see [[matchTypeByName]] (for matching by types' string names)
     */
    static matchType(expectedType, actualType, actualValue = null) {
        if (expectedType == null) {
            return true;
        }
        if (actualType == null) {
            throw new Error("Actual type cannot be null");
        }
        if (Number.isInteger(expectedType)) {
            if (expectedType == actualType)
                return true;
            // Special provisions for dynamic data
            if (expectedType == TypeCode_1.TypeCode.Integer
                && (actualType == TypeCode_1.TypeCode.Long || actualType == TypeCode_1.TypeCode.Float || actualType == TypeCode_1.TypeCode.Double))
                return true;
            if (expectedType == TypeCode_1.TypeCode.Long
                && (actualType == TypeCode_1.TypeCode.Integer || actualType == TypeCode_1.TypeCode.Float || actualType == TypeCode_1.TypeCode.Double))
                return true;
            if (expectedType == TypeCode_1.TypeCode.Float
                && (actualType == TypeCode_1.TypeCode.Integer || actualType == TypeCode_1.TypeCode.Long || actualType == TypeCode_1.TypeCode.Double))
                return true;
            if (expectedType == TypeCode_1.TypeCode.Double
                && (actualType == TypeCode_1.TypeCode.Integer || actualType == TypeCode_1.TypeCode.Long || actualType == TypeCode_1.TypeCode.Float))
                return true;
            if (expectedType == TypeCode_1.TypeCode.DateTime
                && (actualType == TypeCode_1.TypeCode.String && convert_1.DateTimeConverter.toNullableDateTime(actualValue) != null))
                return true;
            return false;
        }
        if (typeof expectedType === "string") {
            return TypeMatcher.matchTypeByName(expectedType, actualType, actualValue);
        }
        return false;
    }
    /**
     * Matches expected type to a type of a value.
     *
     * @param expectedType  an expected type name to match.
     * @param actualValue       a value to match its type to the expected one.
     * @returns true if types are matching and false if they don't.
     */
    static matchValueTypeByName(expectedType, actualValue) {
        if (expectedType == null) {
            return true;
        }
        if (actualValue == null) {
            throw new Error("Actual value cannot be null");
        }
        return TypeMatcher.matchTypeByName(expectedType, TypeConverter_1.TypeConverter.toTypeCode(actualValue));
    }
    /**
     * Matches expected type to an actual type.
     *
     * @param expectedType  an expected type name to match.
     * @param actualType    an actual type to match defined by type code.
     * @param actualValue   an optional value to match its type to the expected one.
     * @returns true if types are matching and false if they don't.
     */
    static matchTypeByName(expectedType, actualType, actualValue = null) {
        if (expectedType == null) {
            return true;
        }
        if (actualType == null) {
            throw new Error("Actual type cannot be null");
        }
        expectedType = expectedType.toLowerCase();
        if (expectedType == "object")
            return true;
        else if (expectedType == "int" || expectedType == "integer") {
            return actualType == TypeCode_1.TypeCode.Integer
                // Special provisions for dynamic data
                || actualType == TypeCode_1.TypeCode.Long;
        }
        else if (expectedType == "long") {
            return actualType == TypeCode_1.TypeCode.Long
                // Special provisions for dynamic data
                || actualType == TypeCode_1.TypeCode.Integer;
        }
        else if (expectedType == "float") {
            return actualType == TypeCode_1.TypeCode.Float
                // Special provisions for dynamic data
                || actualType == TypeCode_1.TypeCode.Double
                || actualType == TypeCode_1.TypeCode.Integer
                || actualType == TypeCode_1.TypeCode.Long;
        }
        else if (expectedType == "double") {
            return actualType == TypeCode_1.TypeCode.Double
                // Special provisions fro dynamic data
                || actualType == TypeCode_1.TypeCode.Float;
        }
        else if (expectedType == "string") {
            return actualType == TypeCode_1.TypeCode.String;
        }
        else if (expectedType == "bool" || expectedType == "boolean") {
            return actualType == TypeCode_1.TypeCode.Boolean;
        }
        else if (expectedType == "date" || expectedType == "datetime") {
            return actualType == TypeCode_1.TypeCode.DateTime
                // Special provisions fro dynamic data
                || (actualType == TypeCode_1.TypeCode.String && convert_1.DateTimeConverter.toNullableDateTime(actualValue) != null);
        }
        else if (expectedType == "timespan" || expectedType == "duration") {
            return actualType == TypeCode_1.TypeCode.Integer
                || actualType == TypeCode_1.TypeCode.Long
                || actualType == TypeCode_1.TypeCode.Float
                || actualType == TypeCode_1.TypeCode.Double;
        }
        else if (expectedType == "enum") {
            return actualType == TypeCode_1.TypeCode.Integer
                || actualType == TypeCode_1.TypeCode.String;
        }
        else if (expectedType == "map" || expectedType == "dict" || expectedType == "dictionary") {
            return actualType == TypeCode_1.TypeCode.Map;
        }
        else if (expectedType == "array" || expectedType == "list") {
            return actualType == TypeCode_1.TypeCode.Array;
        }
        else if (expectedType.endsWith("[]")) {
            // Todo: Check subtype
            return actualType == TypeCode_1.TypeCode.Array;
        }
        else
            return false;
    }
}
exports.TypeMatcher = TypeMatcher;
//# sourceMappingURL=TypeMatcher.js.map