import { Descriptor } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { References } from 'pip-services4-commons-node';

import { DummyController } from '../DummyController';
import { DummyCommandableGrpcController } from '../controllers/DummyCommandableGrpcController';
import { DummyCommandableGrpcClient } from './DummyCommandableGrpcClient';
import { DummyClientFixture } from './DummyClientFixture';

let grpcConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3002
);

suite('DummyCommandableGrpcClient', ()=> {
    let service: DummyCommandableGrpcController;
    let client: DummyCommandableGrpcClient;
    let fixture: DummyClientFixture;

    suiteSetup(async () => {
        let ctrl = new DummyController();

        service = new DummyCommandableGrpcController();
        service.configure(grpcConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-dummies', 'controller', 'default', 'default', '1.0'), ctrl,
            new Descriptor('pip-services-dummies', 'service', 'grpc', 'default', '1.0'), service
        );
        service.setReferences(references);

        await service.open(null);
    });
    
    suiteTeardown(async () => {
        await service.close(null);
    });

    setup(async () => {
        client = new DummyCommandableGrpcClient();
        fixture = new DummyClientFixture(client);

        client.configure(grpcConfig);
        client.setReferences(new References());
        await client.open(null);
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

});
