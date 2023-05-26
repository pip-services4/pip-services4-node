/** @module cache */
import { IContext } from 'pip-services4-components-node';
import { IReconfigurable } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';

import { IStateStore } from './IStateStore';
import { StateEntry } from './StateEntry';
import { StateValue } from './StateValue';

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
export class MemoryStateStore implements IStateStore, IReconfigurable {
    private _states: any = {};
    private _timeout = 0;

	/**
	 * Creates a new instance of the state store.
	 */
    public constructor() {
        //
     }

	/**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
	 */
    public configure(config: ConfigParams): void {
        this._timeout = config.getAsLongWithDefault("options.timeout", this._timeout);
    }

	/**
	 * Clears component state.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
	 */
    private cleanup(): void {
        if (this._timeout == 0) return;

        const cutOffTime: number = new Date().getTime() - this._timeout;

        // Cleanup obsolete entries
        for (const prop in this._states) {
            const entry: StateEntry = <StateEntry>this._states[prop];
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
    public async load<T>(context: IContext, key: string): Promise<T> {
        if (key == null) {
            throw new Error('Key cannot be null');
        }

        // Cleanup the stored states
        this.cleanup();

        // Get entry from the store
        const entry: StateEntry = <StateEntry>this._states[key];

        // Store has nothing
        if (entry == null) {
            return null;
        }

        return entry.getValue();
    }

    /**
     * Loads an array of states from the store using their keys.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param keys              unique state keys.
     * @returns                 an array with state values.
     */
    public async loadBulk<T>(context: IContext, keys: string[]): Promise<StateValue<T>[]> {
        // Cleanup the stored states
        this.cleanup();

        const result: StateValue<T>[] = [];
        
        for (const key of keys) {
            const value = await this.load<T>(context, key);
            result.push({ key: key, value: value });
        }

        return result;
    }

	/**
     * Saves state into the store
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique state key.
     * @param value             a state value to store.
     * @returns                 The value that was stored in the cache.
	 */
    public async save<T>(context: IContext, key: string, value: any): Promise<T> {
        if (key == null) {
            throw new Error('Key cannot be null');
        }

        // Cleanup the stored states
        this.cleanup();

        // Get the entry
        let entry: StateEntry = <StateEntry>this._states[key];

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
            entry = new StateEntry(key, value);
            this._states[key] = entry;
        }

        return value;
    }

	/**
     * Deletes a state from the store by its key.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique state key.
	 */
    public async delete<T>(context: IContext, key: string): Promise<T> {
        if (key == null) {
            throw new Error('Key cannot be null');
        }

        // Cleanup the stored states
        this.cleanup();

        // Get the entry
        const entry: StateEntry = <StateEntry>this._states[key];

        // Remove entry from the cache
        if (entry != null) {
            delete this._states[key];
            return entry.getValue();
        }

        return null;
    }

}
