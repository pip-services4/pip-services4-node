/** @module reflect */
import { TypeCode } from '../convert/TypeCode';
/**
 * Helper class matches value types for equality.
 *
 * This class has symmetric implementation across all languages supported
 * by Pip.Services toolkit and used to support dynamic data processing.
 *
 * @see [[TypeCode]]
 */
export declare class TypeMatcher {
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
    static matchValueType(expectedType: any, actualValue: any): boolean;
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
    static matchType(expectedType: any, actualType: TypeCode, actualValue?: any): boolean;
    /**
     * Matches expected type to a type of a value.
     *
     * @param expectedType  an expected type name to match.
     * @param actualValue       a value to match its type to the expected one.
     * @returns true if types are matching and false if they don't.
     */
    static matchValueTypeByName(expectedType: string, actualValue: any): boolean;
    /**
     * Matches expected type to an actual type.
     *
     * @param expectedType  an expected type name to match.
     * @param actualType    an actual type to match defined by type code.
     * @param actualValue   an optional value to match its type to the expected one.
     * @returns true if types are matching and false if they don't.
     */
    static matchTypeByName(expectedType: string, actualType: TypeCode, actualValue?: any): boolean;
}
