/** 
 * @module state 
 * 
 * Todo: Rewrite the description
 * 
 * @preferred
 * Abstract implementation of various distributed states. We can save an object 
 * to state and retrieve it object by its key, using various implementations.  
 */
 export { StateEntry } from './StateEntry';
 export { IStateStore } from './IStateStore';
 export { NullStateStore } from './NullStateStore';
 export { MemoryStateStore } from './MemoryStateStore';
 export { DefaultStateStoreFactory } from './DefaultStateStoreFactory';
 