import { IContext } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { References } from 'pip-services4-components-node';

import { DummyService } from '../sample/DummyService';
import { DummyGrpcController2 } from '../controllers/DummyGrpcController2';
import { DummyGrpcClient2 } from './DummyGrpcClient2';
import { DummyClientFixture } from './DummyClientFixture';

var grpcConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('DummyGrpcClient', ()=> {
    let controller: DummyGrpcController2;
    let client: DummyGrpcClient2;
    let fixture: DummyClientFixture;

    suiteSetup(async () => {
        let ctrl = new DummyService();

        controller = new DummyGrpcController2();
        controller.configure(grpcConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-dummies', 'controller', 'default', 'default', '1.0'), ctrl,
            new Descriptor('pip-services-dummies', 'service', 'grpc', 'default', '1.0'), controller
        );
        controller.setReferences(references);

        await controller.open(null);
    });
    
    suiteTeardown(async () => {
        await controller.close(null);
    });

    setup(async () => {
        client = new DummyGrpcClient2();
        fixture = new DummyClientFixture(client);

        client.configure(grpcConfig);
        client.setReferences(new References());
        await client.open(null);
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

});
