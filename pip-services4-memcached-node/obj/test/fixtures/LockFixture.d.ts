import { ILock } from 'pip-services4-components-node';
export declare class LockFixture {
    private _lock;
    constructor(lock: ILock);
    testTryAcquireLock(): Promise<void>;
    testAcquireLock(): Promise<void>;
    testReleaseLock(): Promise<void>;
}
