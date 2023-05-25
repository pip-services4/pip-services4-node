import { MemoryLock } from '../../src/lock/MemoryLock';
import { LockFixture } from './LockFixture';

suite('MemoryLock', ()=> {
    var _lock: MemoryLock;
    var _fixture: LockFixture;

    setup(() => {
        _lock = new MemoryLock();
        _fixture = new LockFixture(_lock);
    });

    test('Try Acquire Lock', async () => {
        await _fixture.testTryAcquireLock();
    });

    test('Acquire Lock', async () => {
        await _fixture.testAcquireLock();
    });

    test('Release Lock', async () => {
        await _fixture.testReleaseLock();
    });

});
