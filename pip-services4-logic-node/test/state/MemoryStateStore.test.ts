import { MemoryStateStore } from '../../src/state/MemoryStateStore';
import { StateStoreFixture } from './StateStoreFixture';

suite('MemoryStateStore', ()=> {
    let _cache: MemoryStateStore;
    let _fixture: StateStoreFixture;

    setup(() => {
        _cache = new MemoryStateStore();
        _fixture = new StateStoreFixture(_cache);
    });

    test('Save and Load', async () => {
        await _fixture.testSaveAndLoad();
    });    

    test('Delete', async () => {
        await _fixture.testDelete();
    });    
    
});
