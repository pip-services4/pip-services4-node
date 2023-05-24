/** @module data */
/**
 * Interface for data objects that can be versioned.
 *
 * Versioning is often used as optimistic concurrency mechanism.
 *
 * The version doesn't have to be a number, but it is recommended to use sequential
 * values to determine if one object has newer or older version than another one.
 *
 * It is a common pattern to use the time of change as the object version.
 *
 * ### Example ###
 *
 *     export class MyData implements IStringIdentifiable, IVersioned {
 *         public id: string;
 *         public field1: string;
 *         public field2: number;
 *         public version: string;
 *         ...
 *     }
 *
 *     public updateData(correlationId: string, item: MyData): void {
 *         ...
 *         if (item.version < oldItem.version) {
 *             throw new ConcurrencyException(null, "VERSION_CONFLICT", "The change has older version stored value");
 *         }
 *         ...
 *     }
 */
export interface IVersioned {
    /** The object's version. */
    version: string;
}
