/** @module data */
/**
 * Interface for data objects that have human-readable names.
 *
 * ### Example ###
 *
 *     export class MyData implements IStringIdentifiable, INamed {
 *         public id: string;
 *         public name: string;
 *         public field1: string;
 *         public field2: number;
 *         ...
 *     }
 */
export interface INamed {
    /** The object's humand-readable name. */
    name: string;
}
