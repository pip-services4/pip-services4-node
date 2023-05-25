/**
 * A data object that holds a retrieved state value with its key.
 */
export class StateValue<T> {
    /**
     * A unique state key
     */
    public key: string;
    /**
     * A stored state value;
     */
    public value: T;
}