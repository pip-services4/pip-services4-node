const process = require('process');

import { ConfigParams } from 'pip-services4-components-node';
import { DummyPersistenceFixture } from '../fixtures/DummyPersistenceFixture';
import { DummyMongoDbPersistence } from './DummyMongoDbPersistence';

suite('DummyMongoDbPersistence', ()=> {
    let persistence: DummyMongoDbPersistence;
    let fixture: DummyPersistenceFixture;

    let mongoUri = process.env['MONGO_SERVICE_URI'];
    let mongoHost = process.env['MONGO_SERVICE_HOST'] || 'localhost';
    let mongoPort = process.env['MONGO_SERVICE_PORT'] || 27017;
    let mongoDatabase = process.env['MONGO_DB'] || 'test';
    let mongoUser = process.env['MONGO_USER'] || '';
    let mongoPass = process.env['MONGO_PASS'] || '';

    if (mongoUri == null && mongoHost == null) {
        return;
    }

    setup(async () => {
        let dbConfig = ConfigParams.fromTuples(
            'connection.uri', mongoUri,
            'connection.host', mongoHost,
            'connection.port', mongoPort,
            'connection.database', mongoDatabase,
            'credential.username', mongoUser,
            'credential.password', mongoPass,
        );

        persistence = new DummyMongoDbPersistence();
        persistence.configure(dbConfig);

        fixture = new DummyPersistenceFixture(persistence);

        await persistence.open(null);
        await persistence.clear(null);
    });

    teardown(async () => {
        await persistence.close(null);
    });

    test('Crud Operations', async () => {
        await fixture.testCrudOperations();
    });

    test('Batch Operations', async () => {
        await fixture.testBatchOperations();
    });
});