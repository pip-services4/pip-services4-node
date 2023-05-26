"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryCache = exports.NullCache = exports.CacheEntry = void 0;
/**
 * @module cache
 *
 * Todo: Rewrite the description
 *
 * @preferred
 * Abstract implementation of various distributed caches. We can save an object
 * to cache and retrieve it object by its key, using various implementations.
 */
var CacheEntry_1 = require("./CacheEntry");
Object.defineProperty(exports, "CacheEntry", { enumerable: true, get: function () { return CacheEntry_1.CacheEntry; } });
var NullCache_1 = require("./NullCache");
Object.defineProperty(exports, "NullCache", { enumerable: true, get: function () { return NullCache_1.NullCache; } });
var MemoryCache_1 = require("./MemoryCache");
Object.defineProperty(exports, "MemoryCache", { enumerable: true, get: function () { return MemoryCache_1.MemoryCache; } });
//# sourceMappingURL=index.js.map