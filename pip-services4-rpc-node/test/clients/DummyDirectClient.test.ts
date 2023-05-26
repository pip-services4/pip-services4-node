import { Descriptor } from 'pip-services4-components-node';
import { References } from 'pip-services4-components-node';

import { Dummy } from '../sample/Dummy';
import { DummyService } from '../sample/DummyService';
import { DummyClientFixture } from './DummyClientFixture';
import { DummyDirectClient } from './DummyDirectClient';

suite('DummyDirectClient', ()=> {
    let _dummy1: Dummy;
    let _dummy2: Dummy;

    let client: DummyDirectClient;
    let fixture: DummyClientFixture;

    suiteSetup(async () => {
        let ctrl = new DummyService();
        client = new DummyDirectClient();

        let references: References = References.fromTuples(
            new Descriptor('pip-services-dummies', 'service', 'default', 'default', '1.0'), ctrl
        );
        client.setReferences(references);

        fixture = new DummyClientFixture(client);

        await client.open(null);
    });
    
    suiteTeardown(async () => {
        await client.close(null);
    });

    setup(() => {
        _dummy1 = { id: null, key: "Key 1", content: "Content 1", array: [ { key: "SubKey 1", content: "SubContent 1"} ]};
        _dummy2 = { id: null, key: "Key 2", content: "Content 2", array: [ { key: "SubKey 1", content: "SubContent 1"} ]};
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

});
