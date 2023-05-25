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
export { AnyValue } from './AnyValue';
export { AnyValueArray } from './AnyValueArray';
export { AnyValueMap } from './AnyValueMap';
export { StringValueMap } from './StringValueMap';
export { ICloneable } from './ICloneable';
