/** @module state */
import { IContext } from 'pip-services4-components-node';
import { StateValue } from "./StateValue";
/**
 * Interface for state storages that are used to store and retrieve transaction states.
 */
export interface IStateStore {
    /**
     * Loads state from the store using its key.
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
     * @returns                 an array with state values and their corresponding keys.
     */
    loadBulk<T>(context: IContext, keys: string[]): Promise<StateValue<T>[]>;
    /**
     * Saves state into the store.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique state key.
     * @param value             a state value.
     * @returns                 The state that was stored in the store.
     */
    save<T>(context: IContext, key: string, value: any): Promise<T>;
    /**
     * Deletes a state from the store by its key.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique value key.
     */
    delete<T>(context: IContext, key: string): Promise<T>;
}
