const assert = require('chai').assert;
const process = require('process');

import { ConfigParams } from 'pip-services4-commons-node';
import { MongoDbConnection } from '../../src/connect/MongoDbConnection';

suite('MongoDbConnection', ()=> {
    let connection: MongoDbConnection;

    let mongoUri = process.env['MONGO_SERVICE_URI'];
    let mongoHost = process.env['MONGO_SERVICE_HOST'] || 'localhost';
    let mongoPort = process.env['MONGO_SERVICE_PORT'] || 27017;
    let mongoDatabase = process.env['MONGO_DB'] || 'test';
    let mongoUser = process.env['MONGO_USER'] || '';
    let mongoPass = process.env['MONGO_PASS'] || '';

    // Skip tests
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

        connection = new MongoDbConnection();
        connection.configure(dbConfig);

        await connection.open(null);
    });

    teardown(async () => {
        await connection.close(null);
    });

    test('Open and Close', () => {
        assert.isObject(connection.getConnection());
        assert.isObject(connection.getDatabase());
        assert.isString(connection.getDatabaseName());
    });
});