const assert = require('chai').assert;
import process = require('process');

import { SqliteConnection } from '../../src/connect/SqliteConnection';
import { ConfigParams } from 'pip-services4-components-node';

suite('SqliteConnection', ()=> {
    let connection: SqliteConnection;

    let sqliteDatabase = process.env['SQLITE_DB'] || './data/test.db';

    if (sqliteDatabase == null) {
        return;
    }

    setup(async () => {
        let dbConfig = ConfigParams.fromTuples(
            'connection.database', sqliteDatabase
        );

        connection = new SqliteConnection();
        connection.configure(dbConfig);

        await connection.open(null);
    });

    teardown(async () => {
        await connection.close(null);
    });

    test('Open and Close', () => {
        assert.isDefined(connection.getConnection());
        assert.isString(connection.getDatabaseName());
    });
});