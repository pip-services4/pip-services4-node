import { Descriptor } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { References } from 'pip-services4-commons-node';

import { DummyController } from '../DummyController';
import { DummyGrpcController } from '../controllers/DummyGrpcController';
import { DummyGrpcClient } from './DummyGrpcClient';
import { DummyClientFixture } from './DummyClientFixture';

let grpcConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('DummyGrpcClient', ()=> {
    let service: DummyGrpcController;
    let client: DummyGrpcClient;
    let fixture: DummyClientFixture;

    suiteSetup(async () => {
        let ctrl = new DummyController();

        service = new DummyGrpcController();
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
        client = new DummyGrpcClient();
        fixture = new DummyClientFixture(client);

        client.configure(grpcConfig);
        client.setReferences(new References());
        await client.open(null);
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

});
