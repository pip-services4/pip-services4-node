/** @module data */
/**
 * Interface for data objects that are able to create their full binary copy.
 *
 * ### Example ###
 *
 *     export class MyClass implements IMyClass, ICloneable {
 *       constructor() { };
 *
 *       public clone(): any {
 *           var cloneObj = new (<any>this.constructor());
 *
 *           // Copy every attribute from this to cloneObj here.
 *           ...
 *
 *           return cloneObj;
 *       }
 *     }
 */
export interface ICloneable {
    /**
     * Creates a binary clone of this object.
     *
     * @returns a clone of this object.
     */
    clone(): any;
}
