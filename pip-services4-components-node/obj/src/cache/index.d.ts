/**
 * @module cache
 *
 * Todo: Rewrite the description
 *
 * @preferred
 * Abstract implementation of various distributed caches. We can save an object
 * to cache and retrieve it object by its key, using various implementations.
 */
export { CacheEntry } from './CacheEntry';
export { ICache } from './ICache';
export { NullCache } from './NullCache';
export { MemoryCache } from './MemoryCache';
export { DefaultCacheFactory } from './DefaultCacheFactory';
