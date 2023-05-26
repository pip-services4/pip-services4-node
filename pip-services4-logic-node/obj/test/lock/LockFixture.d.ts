import { ILock } from '../../src/lock/ILock';
export declare class LockFixture {
    private _lock;
    constructor(lock: ILock);
    testTryAcquireLock(): Promise<void>;
    testAcquireLock(): Promise<void>;
    testReleaseLock(): Promise<void>;
}
