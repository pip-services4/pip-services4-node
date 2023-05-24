/** @module variants */
import { Variant } from './Variant';
import { VariantType } from './VariantType';
import { AbstractVariantOperations } from './AbstractVariantOperations';
/**
 * Implements a strongly typed (type safe) variant operations manager object.
 */
export declare class TypeSafeVariantOperations extends AbstractVariantOperations {
    /**
     * Converts variant to specified type
     * @param value A variant value to be converted.
     * @param newType A type of object to be returned.
     * @returns A converted Variant value.
     */
    convert(value: Variant, newType: VariantType): Variant;
    private convertFromInteger;
    private convertFromLong;
    private convertFromFloat;
}
