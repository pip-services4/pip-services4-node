/**
 * A data object that holds a retrieved state value with its key.
 */
export declare class StateValue<T> {
    /**
     * A unique state key
     */
    key: string;
    /**
     * A stored state value;
     */
    value: T;
}
