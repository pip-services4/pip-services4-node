import { Variant } from './Variant';
import { VariantType } from './VariantType';
import { AbstractVariantOperations } from './AbstractVariantOperations';
/**
 * Implements a type unsafe variant operations manager object.
 */
export declare class TypeUnsafeVariantOperations extends AbstractVariantOperations {
    /**
     * Converts variant to specified type
     * @param value A variant value to be converted.
     * @param newType A type of object to be returned.
     * @returns A converted Variant value.
     */
    convert(value: Variant, newType: VariantType): Variant;
    private convertFromNull;
    private convertFromInteger;
    private convertFromLong;
    private convertFromFloat;
    private convertFromDouble;
    private convertFromString;
    private convertFromBoolean;
    private convertFromDateTime;
    private convertFromTimeSpan;
}
