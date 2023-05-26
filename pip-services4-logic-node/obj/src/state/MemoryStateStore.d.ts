/** @module cache */
import { IContext } from 'pip-services4-components-node';
import { IReconfigurable } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { IStateStore } from './IStateStore';
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
export declare class MemoryStateStore implements IStateStore, IReconfigurable {
    private _states;
    private _timeout;
    /**
     * Creates a new instance of the state store.
     */
    constructor();
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Clears component state.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    private cleanup;
    /**
     * Loads stored value from the store using its key.
     * If value is missing in the store it returns null.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique state key.
     * @returns                 the state value or <code>null</code> if value wasn't found.
     */
    load<T>(context: IContext, key: string): Promise<T>;
    /**
     * Loads an array of states from the store using their keys.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param keys              unique state keys.
     * @returns                 an array with state values.
     */
    loadBulk<T>(context: IContext, keys: string[]): Promise<StateValue<T>[]>;
    /**
     * Saves state into the store
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique state key.
     * @param value             a state value to store.
     * @returns                 The value that was stored in the cache.
     */
    save<T>(context: IContext, key: string, value: any): Promise<T>;
    /**
     * Deletes a state from the store by its key.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique state key.
     */
    delete<T>(context: IContext, key: string): Promise<T>;
}
