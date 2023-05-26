"use strict";
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
exports.MemoryCache = void 0;
const CacheEntry_1 = require("./CacheEntry");
/**
 * Cache that stores values in the process memory.
 *
 * Remember: This implementation is not suitable for synchronization of distributed processes.
 *
 * ### Configuration parameters ###
 *
 * __options:__
 * - timeout:               default caching timeout in milliseconds (default: 1 minute)
 * - max_size:              maximum number of values stored in this cache (default: 1000)
 *
 * @see [[ICache]]
 *
 * ### Example ###
 *
 *     let cache = new MemoryCache();
 *
 *     await cache.store("123", "key1", "ABC");
 *     ...
 *     let value = await cache.retrieve("123", "key1");
 *     // Result: "ABC"
 *
 */
class MemoryCache {
    /**
     * Creates a new instance of the cache.
     */
    constructor() {
        this._cache = {};
        this._count = 0;
        this._timeout = 60000;
        this._maxSize = 1000;
        //
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._timeout = config.getAsLongWithDefault("options.timeout", this._timeout);
        this._maxSize = config.getAsLongWithDefault("options.max_size", this._maxSize);
    }
    /**
     * Clears component state.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    cleanup() {
        let oldest = null;
        // const now: number = new Date().getTime();
        this._count = 0;
        // Cleanup obsolete entries and find the oldest
        for (const prop in this._cache) {
            const entry = this._cache[prop];
            // Remove obsolete entry
            if (entry.isExpired()) {
                delete this._cache[prop];
            }
            // Count the remaining entry 
            else {
                this._count++;
                if (oldest == null || oldest.getExpiration() > entry.getExpiration())
                    oldest = entry;
            }
        }
        // Remove the oldest if cache size exceeded maximum
        if (this._count > this._maxSize && oldest != null) {
            delete this._cache[oldest.getKey()];
            this._count--;
        }
    }
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
            if (key == null) {
                throw new Error('Key cannot be null');
            }
            // Get entry from the cache
            const entry = this._cache[key];
            // Cache has nothing
            if (entry == null) {
                return null;
            }
            // Remove entry if expiration set and entry is expired
            if (this._timeout > 0 && entry.isExpired()) {
                delete this._cache[key];
                this._count--;
                return null;
            }
            return entry.getValue();
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
            if (key == null) {
                throw new Error('Key cannot be null');
            }
            // Get the entry
            let entry = this._cache[key];
            // Shortcut to remove entry from the cache
            if (value == null) {
                if (entry != null) {
                    delete this._cache[key];
                    this._count--;
                }
                return value;
            }
            timeout = timeout != null && timeout > 0 ? timeout : this._timeout;
            // Update the entry
            if (entry) {
                entry.setValue(value, timeout);
            }
            // Or create a new entry 
            else {
                entry = new CacheEntry_1.CacheEntry(key, value, timeout);
                this._cache[key] = entry;
                this._count++;
            }
            // Clean up the cache
            if (this._maxSize > 0 && this._count > this._maxSize) {
                this.cleanup();
            }
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
            if (key == null) {
                throw new Error('Key cannot be null');
            }
            // Get the entry
            const entry = this._cache[key];
            // Remove entry from the cache
            if (entry != null) {
                delete this._cache[key];
                this._count--;
            }
        });
    }
}
exports.MemoryCache = MemoryCache;
//# sourceMappingURL=MemoryCache.js.map