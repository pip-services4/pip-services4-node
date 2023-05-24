"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeUnsafeVariantOperations = void 0;
/** @module variants */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const pip_services3_commons_node_3 = require("pip-services4-commons-node");
const pip_services3_commons_node_4 = require("pip-services4-commons-node");
const pip_services3_commons_node_5 = require("pip-services4-commons-node");
const pip_services3_commons_node_6 = require("pip-services4-commons-node");
const pip_services3_commons_node_7 = require("pip-services4-commons-node");
const Variant_1 = require("./Variant");
const VariantType_1 = require("./VariantType");
const AbstractVariantOperations_1 = require("./AbstractVariantOperations");
/**
 * Implements a type unsafe variant operations manager object.
 */
class TypeUnsafeVariantOperations extends AbstractVariantOperations_1.AbstractVariantOperations {
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
        if (newType == VariantType_1.VariantType.String) {
            let result = new Variant_1.Variant();
            result.asString = pip_services3_commons_node_1.StringConverter.toString(value.asObject);
            return result;
        }
        switch (value.type) {
            case VariantType_1.VariantType.Null:
                return this.convertFromNull(newType);
            case VariantType_1.VariantType.Integer:
                return this.convertFromInteger(value, newType);
            case VariantType_1.VariantType.Long:
                return this.convertFromLong(value, newType);
            case VariantType_1.VariantType.Float:
                return this.convertFromFloat(value, newType);
            case VariantType_1.VariantType.Double:
                return this.convertFromDouble(value, newType);
            case VariantType_1.VariantType.DateTime:
                return this.convertFromDateTime(value, newType);
            case VariantType_1.VariantType.TimeSpan:
                return this.convertFromTimeSpan(value, newType);
            case VariantType_1.VariantType.String:
                return this.convertFromString(value, newType);
            case VariantType_1.VariantType.Boolean:
                return this.convertFromBoolean(value, newType);
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type)
            + " to " + this.typeToString(newType) + " is not supported.");
    }
    convertFromNull(newType) {
        let result = new Variant_1.Variant();
        switch (newType) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = 0;
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = 0;
                return result;
            case VariantType_1.VariantType.Float:
                result.asFloat = 0;
                return result;
            case VariantType_1.VariantType.Double:
                result.asDouble = 0;
                return result;
            case VariantType_1.VariantType.Boolean:
                result.asBoolean = false;
                return result;
            case VariantType_1.VariantType.DateTime:
                result.asDateTime = new Date(0);
                return result;
            case VariantType_1.VariantType.TimeSpan:
                result.asTimeSpan = 0;
                return result;
            case VariantType_1.VariantType.String:
                result.asString = "null";
                return result;
            case VariantType_1.VariantType.Object:
                result.asObject = null;
                return result;
            case VariantType_1.VariantType.Array:
                result.asArray = null;
                return result;
        }
        throw new Error("Variant convertion from Null "
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
            case VariantType_1.VariantType.DateTime:
                result.asDateTime = new Date(value.asInteger);
                return result;
            case VariantType_1.VariantType.TimeSpan:
                result.asTimeSpan = value.asInteger;
                return result;
            case VariantType_1.VariantType.Boolean:
                result.asBoolean = value.asInteger != 0;
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type)
            + " to " + this.typeToString(newType) + " is not supported.");
    }
    convertFromLong(value, newType) {
        let result = new Variant_1.Variant();
        switch (newType) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = value.asLong;
                return result;
            case VariantType_1.VariantType.Float:
                result.asFloat = value.asLong;
                return result;
            case VariantType_1.VariantType.Double:
                result.asDouble = value.asLong;
                return result;
            case VariantType_1.VariantType.DateTime:
                result.asDateTime = new Date(value.asLong);
                return result;
            case VariantType_1.VariantType.TimeSpan:
                result.asTimeSpan = value.asLong;
                return result;
            case VariantType_1.VariantType.Boolean:
                result.asBoolean = value.asLong != 0;
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type)
            + " to " + this.typeToString(newType) + " is not supported.");
    }
    convertFromFloat(value, newType) {
        let result = new Variant_1.Variant();
        switch (newType) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = Math.trunc(value.asFloat);
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = Math.trunc(value.asFloat);
                return result;
            case VariantType_1.VariantType.Double:
                result.asDouble = value.asFloat;
                return result;
            case VariantType_1.VariantType.Boolean:
                result.asBoolean = value.asFloat != 0;
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type)
            + " to " + this.typeToString(newType) + " is not supported.");
    }
    convertFromDouble(value, newType) {
        let result = new Variant_1.Variant();
        switch (newType) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = Math.trunc(value.asDouble);
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = Math.trunc(value.asDouble);
                return result;
            case VariantType_1.VariantType.Float:
                result.asFloat = value.asDouble;
                return result;
            case VariantType_1.VariantType.Boolean:
                result.asBoolean = value.asDouble != 0;
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type)
            + " to " + this.typeToString(newType) + " is not supported.");
    }
    convertFromString(value, newType) {
        let result = new Variant_1.Variant();
        switch (newType) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = pip_services3_commons_node_2.IntegerConverter.toInteger(value.asString);
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = pip_services3_commons_node_3.LongConverter.toLong(value.asString);
                return result;
            case VariantType_1.VariantType.Float:
                result.asFloat = pip_services3_commons_node_4.FloatConverter.toFloat(value.asString);
                return result;
            case VariantType_1.VariantType.Double:
                result.asDouble = pip_services3_commons_node_5.DoubleConverter.toDouble(value.asString);
                return result;
            case VariantType_1.VariantType.DateTime:
                result.asDateTime = pip_services3_commons_node_6.DateTimeConverter.toDateTime(value.asString);
                return result;
            case VariantType_1.VariantType.TimeSpan:
                result.asTimeSpan = pip_services3_commons_node_3.LongConverter.toLong(value.asString);
                return result;
            case VariantType_1.VariantType.Boolean:
                result.asBoolean = pip_services3_commons_node_7.BooleanConverter.toBoolean(value.asString);
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type)
            + " to " + this.typeToString(newType) + " is not supported.");
    }
    convertFromBoolean(value, newType) {
        let result = new Variant_1.Variant();
        switch (newType) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = value.asBoolean ? 1 : 0;
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = value.asBoolean ? 1 : 0;
                return result;
            case VariantType_1.VariantType.Float:
                result.asFloat = value.asBoolean ? 1 : 0;
                return result;
            case VariantType_1.VariantType.Double:
                result.asDouble = value.asBoolean ? 1 : 0;
                return result;
            case VariantType_1.VariantType.String:
                result.asString = value.asBoolean ? "true" : "false";
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type)
            + " to " + this.typeToString(newType) + " is not supported.");
    }
    convertFromDateTime(value, newType) {
        let result = new Variant_1.Variant();
        switch (newType) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = value.asDateTime.getTime();
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = value.asDateTime.getTime();
                return result;
            case VariantType_1.VariantType.String:
                result.asString = pip_services3_commons_node_1.StringConverter.toString(value.asDateTime);
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type)
            + " to " + this.typeToString(newType) + " is not supported.");
    }
    convertFromTimeSpan(value, newType) {
        let result = new Variant_1.Variant();
        switch (newType) {
            case VariantType_1.VariantType.Integer:
                result.asInteger = value.asTimeSpan;
                return result;
            case VariantType_1.VariantType.Long:
                result.asLong = value.asTimeSpan;
                return result;
            case VariantType_1.VariantType.String:
                result.asString = pip_services3_commons_node_1.StringConverter.toString(value.asTimeSpan);
                return result;
        }
        throw new Error("Variant convertion from " + this.typeToString(value.type)
            + " to " + this.typeToString(newType) + " is not supported.");
    }
}
exports.TypeUnsafeVariantOperations = TypeUnsafeVariantOperations;
//# sourceMappingURL=TypeUnsafeVariantOperations.js.map