import { ILock } from "pip-services4-logic-node";
export declare class LockFixture {
    private _lock;
    constructor(lock: ILock);
    testTryAcquireLock(): Promise<void>;
    testAcquireLock(): Promise<void>;
    testReleaseLock(): Promise<void>;
}
