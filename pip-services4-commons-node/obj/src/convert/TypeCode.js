"use strict";
/** @module convert */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeCode = void 0;
/**
 * Codes for the data types that can be
 * converted using [[TypeConverter]].
 *
 * @see [[TypeConverter]]
 */
var TypeCode;
(function (TypeCode) {
    TypeCode[TypeCode["Unknown"] = 0] = "Unknown";
    TypeCode[TypeCode["String"] = 1] = "String";
    TypeCode[TypeCode["Boolean"] = 2] = "Boolean";
    TypeCode[TypeCode["Integer"] = 3] = "Integer";
    TypeCode[TypeCode["Long"] = 4] = "Long";
    TypeCode[TypeCode["Float"] = 5] = "Float";
    TypeCode[TypeCode["Double"] = 6] = "Double";
    TypeCode[TypeCode["DateTime"] = 7] = "DateTime";
    TypeCode[TypeCode["Duration"] = 8] = "Duration";
    TypeCode[TypeCode["Object"] = 9] = "Object";
    TypeCode[TypeCode["Enum"] = 10] = "Enum";
    TypeCode[TypeCode["Array"] = 11] = "Array";
    TypeCode[TypeCode["Map"] = 12] = "Map";
})(TypeCode = exports.TypeCode || (exports.TypeCode = {}));
//# sourceMappingURL=TypeCode.js.map