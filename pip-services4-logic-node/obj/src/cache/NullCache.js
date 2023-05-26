"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/** @module cache */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullCache = void 0;
/**
 * Dummy cache implementation that doesn't do anything.
 *
 * It can be used in testing or in situations when cache is required
 * but shall be disabled.
 *
 * @see [[ICache]]
 */
class NullCache {
    /**
     * Retrieves cached value from the cache using its key.
     * If value is missing in the cache or expired it returns null.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique value key.
     * @returns                 the cached value or <code>null</code> if value wasn't found.
     */
    retrieve(context, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    /**
     * Stores value in the cache with expiration time.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique value key.
     * @param value             a value to store.
     * @param timeout           expiration timeout in milliseconds.
     * @returns                 The value that was stored in the cache.
     */
    store(context, key, value, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return value;
        });
    }
    /**
     * Removes a value from the cache by its key.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique value key.
     */
    remove(context, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
}
exports.NullCache = NullCache;
//# sourceMappingURL=NullCache.js.map