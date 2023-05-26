"use strict";
/** @module cache */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheEntry = void 0;
/**
 * Data object to store cached values with their keys used by [[MemoryCache]]
 */
class CacheEntry {
    /**
     * Creates a new instance of the cache entry and assigns its values.
     *
     * @param key       a unique key to locate the value.
     * @param value     a value to be stored.
     * @param timeout   expiration timeout in milliseconds.
     */
    constructor(key, value, timeout) {
        this._key = key;
        this._value = value;
        this._expiration = new Date().getTime() + timeout;
    }
    /**
     * Gets the key to locate the cached value.
     *
     * @returns the value key.
     */
    getKey() {
        return this._key;
    }
    /**
     * Gets the cached value.
     *
     * @returns the value object.
     */
    getValue() {
        return this._value;
    }
    /**
     * Gets the expiration timeout.
     *
     * @returns the expiration timeout in milliseconds.
     */
    getExpiration() {
        return this._expiration;
    }
    /**
     * Sets a new value and extends its expiration.
     *
     * @param value     a new cached value.
     * @param timeout   a expiration timeout in milliseconds.
     */
    setValue(value, timeout) {
        this._value = value;
        this._expiration = new Date().getTime() + timeout;
    }
    /**
     * Checks if this value already expired.
     *
     * @returns true if the value already expires and false otherwise.
     */
    isExpired() {
        return this._expiration < new Date().getTime();
    }
}
exports.CacheEntry = CacheEntry;
//# sourceMappingURL=CacheEntry.js.map