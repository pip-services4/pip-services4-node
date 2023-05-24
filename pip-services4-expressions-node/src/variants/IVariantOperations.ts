/** @module variants */
import { Variant } from './Variant';
import { VariantType } from './VariantType';

/**
 * Defines an interface for variant operations manager.
 */
export interface IVariantOperations {
    /**
     * Converts variant to specified type
     * @param value A variant value to be converted.
     * @param newType A type of object to be returned.
     * @returns A converted Variant value.
     */
    convert(value: Variant, newType: VariantType): Variant;

    /**
     * Performs '+' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    add(value1: Variant, value2: Variant): Variant;

    /**
     * Performs '-' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    sub(value1: Variant, value2: Variant): Variant;

    /**
     * Performs '*' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    mul(value1: Variant, value2: Variant): Variant;

    /**
     * Performs '/' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    div(value1: Variant, value2: Variant): Variant;

    /**
     * Performs '%' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    mod(value1: Variant, value2: Variant): Variant;

    /**
     * Performs '^' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    pow(value1: Variant, value2: Variant): Variant;

    /**
     * Performs AND operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    and(value1: Variant, value2: Variant): Variant;

    /**
     * Performs OR operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    or(value1: Variant, value2: Variant): Variant;

    /**
     * Performs XOR operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    xor(value1: Variant, value2: Variant): Variant;

    /**
     * Performs << operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    lsh(value1: Variant, value2: Variant): Variant;

    /**
     * Performs >> operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    rsh(value1: Variant, value2: Variant): Variant;

    /**
     * Performs NOT operation for a variant.
     * @param value The operand for this operation.
     * @returns A result variant object.
     */
    not(value: Variant): Variant;

    /**
     * Performs unary '-' operation for a variant.
     * @param value The operand for this operation.
     * @returns A result variant object.
     */
    negative(value: Variant): Variant;

    /**
     * Performs '=' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    equal(value1: Variant, value2: Variant): Variant;

    /**
     * Performs '<>' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    notEqual(value1: Variant, value2: Variant): Variant;

    /**
     * Performs '>' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    more(value1: Variant, value2: Variant): Variant;

    /**
     * Performs '<' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    less(value1: Variant, value2: Variant): Variant;

    /**
     * Performs '>=' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    moreEqual(value1: Variant, value2: Variant): Variant;

    /**
     * Performs '<=' operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    lessEqual(value1: Variant, value2: Variant): Variant;

    /**
     * Performs IN operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    in(value1: Variant, value2: Variant): Variant;

    /**
     * Performs [] operation for two variants.
     * @param value1 The first operand for this operation.
     * @param value2 The second operand for this operation.
     * @returns A result variant object.
     */
    getElement(value1: Variant, value2: Variant): Variant;
}
