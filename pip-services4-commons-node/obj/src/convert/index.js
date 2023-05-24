"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonConverter = exports.TypeConverter = exports.TypeCode = exports.RecursiveMapConverter = exports.MapConverter = exports.ArrayConverter = exports.DateTimeConverter = exports.DoubleConverter = exports.FloatConverter = exports.LongConverter = exports.IntegerConverter = exports.BooleanConverter = exports.StringConverter = void 0;
/**
 * @module convert
 *
 * Todo: Rewrite this description
 *
 * @preferred
 * Contains "soft" data converters. Soft data converters differ from the data conversion algorithms
 * found in typical programming language, due to the fact that they support rare conversions between
 * various data types (such as integer to timespan, timespan to string, and so on).
 *
 * These converters are necessary, due to the fact that data in enterprise systems is represented in
 * various forms and conversion is often necessary – at times in very difficult combinations.
 */
var StringConverter_1 = require("./StringConverter");
Object.defineProperty(exports, "StringConverter", { enumerable: true, get: function () { return StringConverter_1.StringConverter; } });
var BooleanConverter_1 = require("./BooleanConverter");
Object.defineProperty(exports, "BooleanConverter", { enumerable: true, get: function () { return BooleanConverter_1.BooleanConverter; } });
var IntegerConverter_1 = require("./IntegerConverter");
Object.defineProperty(exports, "IntegerConverter", { enumerable: true, get: function () { return IntegerConverter_1.IntegerConverter; } });
var LongConverter_1 = require("./LongConverter");
Object.defineProperty(exports, "LongConverter", { enumerable: true, get: function () { return LongConverter_1.LongConverter; } });
var FloatConverter_1 = require("./FloatConverter");
Object.defineProperty(exports, "FloatConverter", { enumerable: true, get: function () { return FloatConverter_1.FloatConverter; } });
var DoubleConverter_1 = require("./DoubleConverter");
Object.defineProperty(exports, "DoubleConverter", { enumerable: true, get: function () { return DoubleConverter_1.DoubleConverter; } });
var DateTimeConverter_1 = require("./DateTimeConverter");
Object.defineProperty(exports, "DateTimeConverter", { enumerable: true, get: function () { return DateTimeConverter_1.DateTimeConverter; } });
var ArrayConverter_1 = require("./ArrayConverter");
Object.defineProperty(exports, "ArrayConverter", { enumerable: true, get: function () { return ArrayConverter_1.ArrayConverter; } });
var MapConverter_1 = require("./MapConverter");
Object.defineProperty(exports, "MapConverter", { enumerable: true, get: function () { return MapConverter_1.MapConverter; } });
var RecursiveMapConverter_1 = require("./RecursiveMapConverter");
Object.defineProperty(exports, "RecursiveMapConverter", { enumerable: true, get: function () { return RecursiveMapConverter_1.RecursiveMapConverter; } });
var TypeCode_1 = require("./TypeCode");
Object.defineProperty(exports, "TypeCode", { enumerable: true, get: function () { return TypeCode_1.TypeCode; } });
var TypeConverter_1 = require("./TypeConverter");
Object.defineProperty(exports, "TypeConverter", { enumerable: true, get: function () { return TypeConverter_1.TypeConverter; } });
var JsonConverter_1 = require("./JsonConverter");
Object.defineProperty(exports, "JsonConverter", { enumerable: true, get: function () { return JsonConverter_1.JsonConverter; } });
//# sourceMappingURL=index.js.map