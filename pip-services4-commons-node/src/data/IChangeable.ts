/** @module data */

/**
 * Interface for data objects that contain their latest change time.
 * 
 * ### Example ###
 * 
 *     export class MyData implements IStringIdentifiable, IChangeable {
 *         public id: string;
 *         public field1: string;
 *         public field2: number;
 *         public change_time: Date;
 *         ...
 *     }
 */
export interface IChangeable {
	/** The UTC time at which the object was last changed (created or updated). */
	change_time: Date;
}
