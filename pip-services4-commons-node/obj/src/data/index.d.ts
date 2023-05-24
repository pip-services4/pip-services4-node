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
export { IIdentifiable } from './IIdentifiable';
export { ICloneable } from './ICloneable';
export { IStringIdentifiable } from './IStringIdentifiable';
export { INamed } from './INamed';
export { IChangeable } from './IChangeable';
export { ITrackable } from './ITrackable';
export { IVersioned } from './IVersioned';
export { IdGenerator } from './IdGenerator';
export { SortField } from './SortField';
export { SortParams } from './SortParams';
export { PagingParams } from './PagingParams';
export { DataPage } from './DataPage';
export { FilterParams } from './FilterParams';
export { ProjectionParams } from './ProjectionParams';
export { MultiString } from './MultiString';
export { TagsProcessor } from './TagsProcessor';
export { TokenizedDataPage } from './TokenizedDataPage';
export { TokenizedPagingParams } from './TokenizedPagingParams';
