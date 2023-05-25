"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringValueMap = exports.AnyValueMap = exports.AnyValueArray = exports.AnyValue = void 0;
/**
 * @module data
 *
 * Todo: Rewrite this description
 *
 * @preferred
 * Abstract, portable data types. For example – anytype, anyvalues, anyarrays, anymaps, stringmaps
 * (on which many serializable objects are based on – configmap, filtermaps, connectionparams – all
 * extend stringvaluemap). Includes standard design patterns for working with data (data paging,
 * filtering, GUIDs).
 */
var AnyValue_1 = require("./AnyValue");
Object.defineProperty(exports, "AnyValue", { enumerable: true, get: function () { return AnyValue_1.AnyValue; } });
var AnyValueArray_1 = require("./AnyValueArray");
Object.defineProperty(exports, "AnyValueArray", { enumerable: true, get: function () { return AnyValueArray_1.AnyValueArray; } });
var AnyValueMap_1 = require("./AnyValueMap");
Object.defineProperty(exports, "AnyValueMap", { enumerable: true, get: function () { return AnyValueMap_1.AnyValueMap; } });
var StringValueMap_1 = require("./StringValueMap");
Object.defineProperty(exports, "StringValueMap", { enumerable: true, get: function () { return StringValueMap_1.StringValueMap; } });
//# sourceMappingURL=index.js.map