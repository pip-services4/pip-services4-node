"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenizedPagingParams = exports.TokenizedDataPage = exports.TagsProcessor = exports.MultiString = exports.ProjectionParams = exports.FilterParams = exports.DataPage = exports.PagingParams = exports.SortParams = exports.SortField = exports.IdGenerator = exports.StringValueMap = exports.AnyValueMap = exports.AnyValueArray = exports.AnyValue = void 0;
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
var IdGenerator_1 = require("./IdGenerator");
Object.defineProperty(exports, "IdGenerator", { enumerable: true, get: function () { return IdGenerator_1.IdGenerator; } });
var SortField_1 = require("./SortField");
Object.defineProperty(exports, "SortField", { enumerable: true, get: function () { return SortField_1.SortField; } });
var SortParams_1 = require("./SortParams");
Object.defineProperty(exports, "SortParams", { enumerable: true, get: function () { return SortParams_1.SortParams; } });
var PagingParams_1 = require("./PagingParams");
Object.defineProperty(exports, "PagingParams", { enumerable: true, get: function () { return PagingParams_1.PagingParams; } });
var DataPage_1 = require("./DataPage");
Object.defineProperty(exports, "DataPage", { enumerable: true, get: function () { return DataPage_1.DataPage; } });
var FilterParams_1 = require("./FilterParams");
Object.defineProperty(exports, "FilterParams", { enumerable: true, get: function () { return FilterParams_1.FilterParams; } });
var ProjectionParams_1 = require("./ProjectionParams");
Object.defineProperty(exports, "ProjectionParams", { enumerable: true, get: function () { return ProjectionParams_1.ProjectionParams; } });
var MultiString_1 = require("./MultiString");
Object.defineProperty(exports, "MultiString", { enumerable: true, get: function () { return MultiString_1.MultiString; } });
var TagsProcessor_1 = require("./TagsProcessor");
Object.defineProperty(exports, "TagsProcessor", { enumerable: true, get: function () { return TagsProcessor_1.TagsProcessor; } });
var TokenizedDataPage_1 = require("./TokenizedDataPage");
Object.defineProperty(exports, "TokenizedDataPage", { enumerable: true, get: function () { return TokenizedDataPage_1.TokenizedDataPage; } });
var TokenizedPagingParams_1 = require("./TokenizedPagingParams");
Object.defineProperty(exports, "TokenizedPagingParams", { enumerable: true, get: function () { return TokenizedPagingParams_1.TokenizedPagingParams; } });
//# sourceMappingURL=index.js.map