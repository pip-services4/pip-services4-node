/** @module cache */
/**
 * Data object to store cached values with their keys used by [[MemoryCache]]
 */
export declare class CacheEntry {
    private _key;
    private _value;
    private _expiration;
    /**
     * Creates a new instance of the cache entry and assigns its values.
     *
     * @param key       a unique key to locate the value.
     * @param value     a value to be stored.
     * @param timeout   expiration timeout in milliseconds.
     */
    constructor(key: string, value: any, timeout: number);
    /**
     * Gets the key to locate the cached value.
     *
     * @returns the value key.
     */
    getKey(): string;
    /**
     * Gets the cached value.
     *
     * @returns the value object.
     */
    getValue(): any;
    /**
     * Gets the expiration timeout.
     *
     * @returns the expiration timeout in milliseconds.
     */
    getExpiration(): number;
    /**
     * Sets a new value and extends its expiration.
     *
     * @param value     a new cached value.
     * @param timeout   a expiration timeout in milliseconds.
     */
    setValue(value: any, timeout: number): void;
    /**
     * Checks if this value already expired.
     *
     * @returns true if the value already expires and false otherwise.
     */
    isExpired(): boolean;
}
