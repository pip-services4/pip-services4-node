import { ICache } from "pip-services4-logic-node";
export declare class CacheFixture {
    private _cache;
    constructor(cache: ICache);
    testStoreAndRetrieve(): Promise<void>;
    testRetrieveExpired(): Promise<void>;
    testRemove(): Promise<void>;
}
