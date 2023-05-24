import { MemoryCache } from '../../src/cache/MemoryCache';
import { CacheFixture } from './CacheFixture';

suite('MemoryCache', ()=> {
    let _cache: MemoryCache;
    let _fixture: CacheFixture;

    setup(() => {
        _cache = new MemoryCache();
        _fixture = new CacheFixture(_cache);
    });

    test('Store and Retrieve', async () => {
        await _fixture.testStoreAndRetrieve();
    });    

    test('Retrieve Expired', async () => {
        await _fixture.testRetrieveExpired();
    });    

    test('Remove', async () => {
        await _fixture.testRemove();
    });    
    
});
