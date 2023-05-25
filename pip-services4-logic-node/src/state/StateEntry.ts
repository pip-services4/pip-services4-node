/** @module state */

/**
 * Data object to store state values with their keys used by [[MemoryStateEntry]]
 */
 export class StateEntry {
    private _key: string;
    private _value: any;
    private _lastUpdateTime: number;

    /**
     * Creates a new instance of the state entry and assigns its values.
     * 
     * @param key       a unique key to locate the value.
     * @param value     a value to be stored.
     */
    public constructor(key: string, value: any) {
        this._key = key;
        this._value = value;
        this._lastUpdateTime = new Date().getTime();
    }

    /**
     * Gets the key to locate the state value.
     * 
     * @returns the value key.
     */
    public getKey(): string {
        return this._key;
    }

    /**
     * Gets the sstate value.
     * 
     * @returns the value object.
     */
    public getValue(): any {
        return this._value;
    }

    /**
     * Gets the last update time.
     * 
     * @returns the timestamp when the value ware stored.
     */
    public getLastUpdateTime(): number {
        return this._lastUpdateTime;
    }

    /**
     * Sets a new state value.
     * 
     * @param value     a new cached value.
     */
    public setValue(value: any): void {
        this._value = value;
        this._lastUpdateTime = new Date().getTime();
    }

}
