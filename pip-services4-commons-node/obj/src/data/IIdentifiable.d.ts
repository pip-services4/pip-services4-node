/** @module data */
/**
 * Generic interface for data objects that can be uniquely identified by an id.
 *
 * The type specified in the interface defines the type of id field.
 *
 * ### Example ###
 *
 *     export class MyData implements IIdentifiable<string> {
 *         public id: string;
 *         public field1: string;
 *         public field2: number;
 *         ...
 *     }
 */
export interface IIdentifiable<K> {
    /** The unique object identifier of type K. */
    id: K;
}
