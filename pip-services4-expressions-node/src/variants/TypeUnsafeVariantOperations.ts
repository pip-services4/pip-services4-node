/** @module variants */
import { StringConverter } from 'pip-services4-commons-node';
import { IntegerConverter } from 'pip-services4-commons-node';
import { LongConverter } from 'pip-services4-commons-node';
import { FloatConverter } from 'pip-services4-commons-node';
import { DoubleConverter } from 'pip-services4-commons-node';
import { DateTimeConverter } from 'pip-services4-commons-node';
import { BooleanConverter } from 'pip-services4-commons-node';

import { Variant } from './Variant';
import { VariantType } from './VariantType';
import { AbstractVariantOperations } from './AbstractVariantOperations';

/**
 * Implements a type unsafe variant operations manager object.
 */
export class TypeUnsafeVariantOperations extends AbstractVariantOperations {
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
        if (newType == VariantType.String) {
            let result = new Variant();
            result.asString = StringConverter.toString(value.asObject);
            return result;
        }

        switch (value.type) {
            case VariantType.Null:
                return this.convertFromNull(newType);
            case VariantType.Integer:
                return this.convertFromInteger(value, newType);
            case VariantType.Long:
                return this.convertFromLong(value, newType);
            case VariantType.Float:
                return this.convertFromFloat(value, newType);
            case VariantType.Double:
                return this.convertFromDouble(value, newType);
            case VariantType.DateTime:
                return this.convertFromDateTime(value, newType);
            case VariantType.TimeSpan:
                return this.convertFromTimeSpan(value, newType);
            case VariantType.String:
                return this.convertFromString(value, newType);
            case VariantType.Boolean:
                return this.convertFromBoolean(value, newType);
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type) 
            +  " to " + this.typeToString(newType) + " is not supported.");
    }

    private convertFromNull(newType: VariantType): Variant {
        let result = new Variant();
        switch (newType) {
            case VariantType.Integer:
                result.asInteger = 0;
                return result;
            case VariantType.Long:
                result.asLong = 0;
                return result;
            case VariantType.Float:
                result.asFloat = 0;
                return result;
            case VariantType.Double:
                result.asDouble = 0;
                return result;
            case VariantType.Boolean:
                result.asBoolean = false;
                return result;
            case VariantType.DateTime:
                result.asDateTime = new Date(0);
                return result;
            case VariantType.TimeSpan:
                result.asTimeSpan = 0;
                return result;
            case VariantType.String:
                result.asString = "null";
                return result;
            case VariantType.Object:
                result.asObject = null;
                return result;
            case VariantType.Array:
                result.asArray = null;
                return result;
        }
        throw new Error("Variant convertion from Null " 
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
            case VariantType.DateTime:
                result.asDateTime = new Date(value.asInteger);
                return result;
            case VariantType.TimeSpan:
                result.asTimeSpan = value.asInteger;
                return result;
            case VariantType.Boolean:
                result.asBoolean = value.asInteger != 0;
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type) 
            +  " to " + this.typeToString(newType) + " is not supported.");
    }

    private convertFromLong(value: Variant, newType: VariantType): Variant {
        let result = new Variant();
        switch (newType) {
            case VariantType.Integer:
                result.asInteger = value.asLong;
                return result;
            case VariantType.Float:
                result.asFloat = value.asLong;
                return result;
            case VariantType.Double:
                result.asDouble = value.asLong;
                return result;
            case VariantType.DateTime:
                result.asDateTime = new Date(value.asLong);
                return result;
            case VariantType.TimeSpan:
                result.asTimeSpan = value.asLong;
                return result;
            case VariantType.Boolean:
                result.asBoolean = value.asLong != 0;
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type) 
            +  " to " + this.typeToString(newType) + " is not supported.");
    }

    private convertFromFloat(value: Variant, newType: VariantType): Variant {
        let result = new Variant();
        switch (newType) {
            case VariantType.Integer:
                result.asInteger = Math.trunc(value.asFloat);
                return result;
            case VariantType.Long:
                result.asLong = Math.trunc(value.asFloat);
                return result;
            case VariantType.Double:
                result.asDouble = value.asFloat;
                return result;
            case VariantType.Boolean:
                result.asBoolean = value.asFloat != 0;
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type) 
            +  " to " + this.typeToString(newType) + " is not supported.");
    }

    private convertFromDouble(value: Variant, newType: VariantType): Variant {
        let result = new Variant();
        switch (newType) {
            case VariantType.Integer:
                result.asInteger = Math.trunc(value.asDouble);
                return result;
            case VariantType.Long:
                result.asLong = Math.trunc(value.asDouble);
                return result;
            case VariantType.Float:
                result.asFloat = value.asDouble;
                return result;
            case VariantType.Boolean:
                result.asBoolean = value.asDouble != 0;
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type) 
            +  " to " + this.typeToString(newType) + " is not supported.");
    }

    private convertFromString(value: Variant, newType: VariantType): Variant {
        let result = new Variant();
        switch (newType) {
            case VariantType.Integer:
                result.asInteger = IntegerConverter.toInteger(value.asString);
                return result;
            case VariantType.Long:
                result.asLong = LongConverter.toLong(value.asString);
                return result;
            case VariantType.Float:
                result.asFloat = FloatConverter.toFloat(value.asString);
                return result;
            case VariantType.Double:
                result.asDouble = DoubleConverter.toDouble(value.asString);
                return result;
            case VariantType.DateTime:
                result.asDateTime = DateTimeConverter.toDateTime(value.asString);
                return result;
            case VariantType.TimeSpan:
                result.asTimeSpan = LongConverter.toLong(value.asString);
                return result;
            case VariantType.Boolean:
                result.asBoolean = BooleanConverter.toBoolean(value.asString);
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type) 
            +  " to " + this.typeToString(newType) + " is not supported.");
    }

    private convertFromBoolean(value: Variant, newType: VariantType): Variant {
        let result = new Variant();
        switch (newType) {
            case VariantType.Integer:
                result.asInteger = value.asBoolean ? 1 : 0;
                return result;
            case VariantType.Long:
                result.asLong = value.asBoolean ? 1 : 0;
                return result;
            case VariantType.Float:
                result.asFloat = value.asBoolean ? 1 : 0;
                return result;
            case VariantType.Double:
                result.asDouble = value.asBoolean ? 1 : 0;
                return result;
            case VariantType.String:
                result.asString = value.asBoolean ? "true" : "false";
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type) 
            +  " to " + this.typeToString(newType) + " is not supported.");
    }

    private convertFromDateTime(value: Variant, newType: VariantType): Variant {
        let result = new Variant();
        switch (newType) {
            case VariantType.Integer:
                result.asInteger = value.asDateTime.getTime();
                return result;
            case VariantType.Long:
                result.asLong = value.asDateTime.getTime();
                return result;
            case VariantType.String:
                result.asString = StringConverter.toString(value.asDateTime);
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type) 
            +  " to " + this.typeToString(newType) + " is not supported.");
    }

    private convertFromTimeSpan(value: Variant, newType: VariantType): Variant {
        let result = new Variant();
        switch (newType) {
            case VariantType.Integer:
                result.asInteger = value.asTimeSpan;
                return result;
            case VariantType.Long:
                result.asLong = value.asTimeSpan;
                return result;
            case VariantType.String:
                result.asString = StringConverter.toString(value.asTimeSpan);
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type) 
            +  " to " + this.typeToString(newType) + " is not supported.");
    }

}