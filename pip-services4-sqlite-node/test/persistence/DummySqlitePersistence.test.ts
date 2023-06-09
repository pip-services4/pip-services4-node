import process = require('process');

import { DummyPersistenceFixture } from '../fixtures/DummyPersistenceFixture';
import { DummySqlitePersistence } from './DummySqlitePersistence';
import { ConfigParams } from 'pip-services4-components-node';

suite('DummySqlitePersistence', ()=> {
    let persistence: DummySqlitePersistence;
    let fixture: DummyPersistenceFixture;

    let sqliteDatabase = process.env['SQLITE_DB'] || './data/test.db';

    if (sqliteDatabase == null) {
        return;
    }

    setup(async () => {
        let dbConfig = ConfigParams.fromTuples(
            'connection.database', sqliteDatabase
        );

        persistence = new DummySqlitePersistence();
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