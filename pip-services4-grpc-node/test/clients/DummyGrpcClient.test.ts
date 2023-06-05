import { DummyGrpcController } from '../controllers/DummyGrpcController';
import { DummyGrpcClient } from './DummyGrpcClient';
import { DummyClientFixture } from './DummyClientFixture';
import { ConfigParams, Descriptor, References } from 'pip-services4-components-node';
import { DummyService } from '../sample/DummyService';

let grpcConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('DummyGrpcClient', ()=> {
    let controller: DummyGrpcController;
    let client: DummyGrpcClient;
    let fixture: DummyClientFixture;

    suiteSetup(async () => {
        let service = new DummyService();

        controller = new DummyGrpcController();
        controller.configure(grpcConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-dummies', 'service', 'default', 'default', '1.0'), service,
            new Descriptor('pip-services-dummies', 'controller', 'grpc', 'default', '1.0'), controller
        );
        controller.setReferences(references);

        await controller.open(null);
    });
    
    suiteTeardown(async () => {
        await controller.close(null);
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
