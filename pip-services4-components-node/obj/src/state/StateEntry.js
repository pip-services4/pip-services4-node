"use strict";
/** @module state */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateEntry = void 0;
/**
 * Data object to store state values with their keys used by [[MemoryStateEntry]]
 */
class StateEntry {
    /**
     * Creates a new instance of the state entry and assigns its values.
     *
     * @param key       a unique key to locate the value.
     * @param value     a value to be stored.
     */
    constructor(key, value) {
        this._key = key;
        this._value = value;
        this._lastUpdateTime = new Date().getTime();
    }
    /**
     * Gets the key to locate the state value.
     *
     * @returns the value key.
     */
    getKey() {
        return this._key;
    }
    /**
     * Gets the sstate value.
     *
     * @returns the value object.
     */
    getValue() {
        return this._value;
    }
    /**
     * Gets the last update time.
     *
     * @returns the timestamp when the value ware stored.
     */
    getLastUpdateTime() {
        return this._lastUpdateTime;
    }
    /**
     * Sets a new state value.
     *
     * @param value     a new cached value.
     */
    setValue(value) {
        this._value = value;
        this._lastUpdateTime = new Date().getTime();
    }
}
exports.StateEntry = StateEntry;
//# sourceMappingURL=StateEntry.js.map