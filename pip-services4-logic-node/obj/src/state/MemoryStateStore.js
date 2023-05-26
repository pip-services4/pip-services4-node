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
exports.MemoryStateStore = void 0;
const StateEntry_1 = require("./StateEntry");
/**
 * State store that keeps states in the process memory.
 *
 * Remember: This implementation is not suitable for synchronization of distributed processes.
 *
 * ### Configuration parameters ###
 *
 * __options:__
 * - timeout:               default caching timeout in milliseconds (default: disabled)
 *
 * @see [[ICache]]
 *
 * ### Example ###
 *
 *     let store = new MemoryStateStore();
 *
 *     let value = await store.load("123", "key1");
 *     ...
 *     await store.save("123", "key1", "ABC");
 *
 */
class MemoryStateStore {
    /**
     * Creates a new instance of the state store.
     */
    constructor() {
        this._states = {};
        this._timeout = 0;
        //
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._timeout = config.getAsLongWithDefault("options.timeout", this._timeout);
    }
    /**
     * Clears component state.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    cleanup() {
        if (this._timeout == 0)
            return;
        const cutOffTime = new Date().getTime() - this._timeout;
        // Cleanup obsolete entries
        for (const prop in this._states) {
            const entry = this._states[prop];
            // Remove obsolete entry
            if (entry.getLastUpdateTime() < cutOffTime) {
                delete this._states[prop];
            }
        }
    }
    /**
     * Loads stored value from the store using its key.
     * If value is missing in the store it returns null.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique state key.
     * @returns                 the state value or <code>null</code> if value wasn't found.
     */
    load(context, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key == null) {
                throw new Error('Key cannot be null');
            }
            // Cleanup the stored states
            this.cleanup();
            // Get entry from the store
            const entry = this._states[key];
            // Store has nothing
            if (entry == null) {
                return null;
            }
            return entry.getValue();
        });
    }
    /**
     * Loads an array of states from the store using their keys.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param keys              unique state keys.
     * @returns                 an array with state values.
     */
    loadBulk(context, keys) {
        return __awaiter(this, void 0, void 0, function* () {
            // Cleanup the stored states
            this.cleanup();
            const result = [];
            for (const key of keys) {
                const value = yield this.load(context, key);
                result.push({ key: key, value: value });
            }
            return result;
        });
    }
    /**
     * Saves state into the store
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique state key.
     * @param value             a state value to store.
     * @returns                 The value that was stored in the cache.
     */
    save(context, key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key == null) {
                throw new Error('Key cannot be null');
            }
            // Cleanup the stored states
            this.cleanup();
            // Get the entry
            let entry = this._states[key];
            // Shortcut to remove entry from the cache
            if (value == null) {
                delete this._states[key];
                return value;
            }
            // Update the entry
            if (entry != null) {
                entry.setValue(value);
            }
            // Or create a new entry 
            else {
                entry = new StateEntry_1.StateEntry(key, value);
                this._states[key] = entry;
            }
            return value;
        });
    }
    /**
     * Deletes a state from the store by its key.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique state key.
     */
    delete(context, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key == null) {
                throw new Error('Key cannot be null');
            }
            // Cleanup the stored states
            this.cleanup();
            // Get the entry
            const entry = this._states[key];
            // Remove entry from the cache
            if (entry != null) {
                delete this._states[key];
                return entry.getValue();
            }
            return null;
        });
    }
}
exports.MemoryStateStore = MemoryStateStore;
//# sourceMappingURL=MemoryStateStore.js.map