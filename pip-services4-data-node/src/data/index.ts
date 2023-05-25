/** 
 * @module data 
 * 
 * Todo: Rewrite this description
 * 
 * @preferred
 * Abstract, portable data types. For example – anytype, anyvalues, anyarrays, anymaps, stringmaps 
 * (on which many serializable objects are based on – configmap, filtermaps, connectionparams – all 
 * extend stringvaluemap). Includes standard design patterns for working with data (data paging, 
 * filtering, GUIDs). 
 */
export { IIdentifiable } from './IIdentifiable';
export { IStringIdentifiable } from './IStringIdentifiable';
export { INamed } from './INamed';
export { IChangeable } from './IChangeable';
export { ITrackable } from './ITrackable';
export { IVersioned } from './IVersioned';
export { MultiString } from './MultiString';
