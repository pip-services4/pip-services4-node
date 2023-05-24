/** @module state */
/**
 * Data object to store state values with their keys used by [[MemoryStateEntry]]
 */
export declare class StateEntry {
    private _key;
    private _value;
    private _lastUpdateTime;
    /**
     * Creates a new instance of the state entry and assigns its values.
     *
     * @param key       a unique key to locate the value.
     * @param value     a value to be stored.
     */
    constructor(key: string, value: any);
    /**
     * Gets the key to locate the state value.
     *
     * @returns the value key.
     */
    getKey(): string;
    /**
     * Gets the sstate value.
     *
     * @returns the value object.
     */
    getValue(): any;
    /**
     * Gets the last update time.
     *
     * @returns the timestamp when the value ware stored.
     */
    getLastUpdateTime(): number;
    /**
     * Sets a new state value.
     *
     * @param value     a new cached value.
     */
    setValue(value: any): void;
}
