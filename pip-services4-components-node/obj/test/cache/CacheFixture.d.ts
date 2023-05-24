import { ICache } from '../../src/cache/ICache';
export declare class CacheFixture {
    private _cache;
    constructor(cache: ICache);
    testStoreAndRetrieve(): Promise<void>;
    testRetrieveExpired(): Promise<void>;
    testRemove(): Promise<void>;
}
