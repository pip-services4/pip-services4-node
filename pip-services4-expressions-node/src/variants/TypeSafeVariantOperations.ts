/** @module variants */
import { Variant } from './Variant';
import { VariantType } from './VariantType';
import { AbstractVariantOperations } from './AbstractVariantOperations';

/**
 * Implements a strongly typed (type safe) variant operations manager object.
 */
export class TypeSafeVariantOperations extends AbstractVariantOperations {
    /**
     * Converts variant to specified type
     * @param value A variant value to be converted.
     * @param newType A type of object to be returned.
     * @returns A converted Variant value.
     */
    public convert(value: Variant, newType: VariantType): Variant {
        if (newType == VariantType.Null) {
            let result = new Variant();
            return result;
        }
        if (newType == value.type || newType == VariantType.Object) {
            return value;
        }

        switch (value.type) {
            case VariantType.Integer:
                return this.convertFromInteger(value, newType);
            case VariantType.Long:
                return this.convertFromLong(value, newType);
            case VariantType.Float:
                return this.convertFromFloat(value, newType);
            case VariantType.Double:
                break;
            case VariantType.String:
                break;
            case VariantType.Boolean:
                break;
            case VariantType.Object:
                return value;
            case VariantType.Array:
                break;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type) 
            +  " to " + this.typeToString(newType) + " is not supported.");
    }

    private convertFromInteger(value: Variant, newType: VariantType): Variant {
        let result = new Variant();
        switch (newType) {
            case VariantType.Long:
                result.asLong = value.asInteger;
                return result;
            case VariantType.Float:
                result.asFloat = value.asInteger;
                return result;
            case VariantType.Double:
                result.asDouble = value.asInteger;
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type) 
            +  " to " + this.typeToString(newType) + " is not supported.");
    }

    private convertFromLong(value: Variant, newType: VariantType): Variant {
        let result = new Variant();
        switch (newType) {
            case VariantType.Float:
                result.asFloat = value.asLong;
                return result;
            case VariantType.Double:
                result.asDouble = value.asLong;
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type) 
            +  " to " + this.typeToString(newType) + " is not supported.");
    }

    private convertFromFloat(value: Variant, newType: VariantType): Variant {
        let result = new Variant();
        switch (newType) {
            case VariantType.Double:
                result.asDouble = value.asFloat;
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type) 
            +  " to " + this.typeToString(newType) + " is not supported.");
    }
}