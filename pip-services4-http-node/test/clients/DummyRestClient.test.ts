import { Descriptor } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { References } from 'pip-services4-components-node';

import { DummyService } from '../sample/DummyService';
import { DummyRestController } from '../controllers/DummyRestController';
import { DummyRestClient } from './DummyRestClient';
import { DummyClientFixture } from './DummyClientFixture';

suite('DummyRestClient', ()=> {
    let controller: DummyRestController;
    let client: DummyRestClient;
    let fixture: DummyClientFixture;

    let restConfig = ConfigParams.fromTuples(
        "connection.protocol", "http",
        "connection.host", "localhost",
        "connection.port", 3000,
        "options.trace_id_place", "headers",
    );
    
    suiteSetup(async () => {
        let service = new DummyService();

        controller = new DummyRestController();
        controller.configure(restConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-dummies', 'service', 'default', 'default', '1.0'), service,
            new Descriptor('pip-services-dummies', 'controller', 'rest', 'default', '1.0'), controller
        );
        controller.setReferences(references);

        await controller.open(null);
    });
    
    suiteTeardown(async () => {
        await controller.close(null);
    });

    setup(async () => {
        client = new DummyRestClient();
        fixture = new DummyClientFixture(client);

        client.configure(restConfig);
        client.setReferences(new References());

        await client.open(null);
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

});
