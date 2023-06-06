const assert = require('chai').assert;
import process = require('process');

import { PostgresConnection } from '../../src/connect/PostgresConnection';
import { ConfigParams } from 'pip-services4-components-node';

suite('PostgresConnection', () => {
    let connection: PostgresConnection;

    let postgresUri = process.env['POSTGRES_URI'];
    let postgresHost = process.env['POSTGRES_HOST'] || 'localhost';
    let postgresPort = process.env['POSTGRES_PORT'] || 5432;
    let postgresDatabase = process.env['POSTGRES_DB'] || 'test';
    let postgresUser = process.env['POSTGRES_USER'] || 'postgres';
    let postgresPassword = process.env['POSTGRES_PASSWORD'] || 'postgres';

    if (postgresUri == null && postgresHost == null) {
        return;
    }

    setup(async () => {
        let dbConfig = ConfigParams.fromTuples(
            'connection.uri', postgresUri,
            'connection.host', postgresHost,
            'connection.port', postgresPort,
            'connection.database', postgresDatabase,
            'credential.username', postgresUser,
            'credential.password', postgresPassword
        );

        connection = new PostgresConnection();
        connection.configure(dbConfig);

        await connection.open(null);
    });

    teardown(async () => {
        await connection.close(null);
    });

    test('Open and Close', () => {
        assert.isObject(connection.getConnection());
        assert.isString(connection.getDatabaseName());
    });
});