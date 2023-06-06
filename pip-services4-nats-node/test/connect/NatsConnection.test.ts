const assert = require('chai').assert;
import process = require('process');


import { NatsConnection } from '../../src/connect/NatsConnection';
import { ConfigParams } from 'pip-services4-components-node';

suite('NatsConnection', ()=> {
    let connection: NatsConnection;

    let brokerHost = process.env['NATS_SERVICE_HOST'] || 'localhost';
    let brokerPort = process.env['NATS_SERVICE_PORT'] || 4222;
    if (brokerHost == '' && brokerPort == '') {
        return;
    }
    let brokerQueue = process.env['NATS_QUEUE'] || 'test';
    let brokerUser = process.env['NATS_USER'];
    let brokerPass = process.env['NATS_PASS'];
    let brokerToken = process.env['NATS_TOKEN'];

    setup(() => {
        let config = ConfigParams.fromTuples(
            'queue', brokerQueue,
            'connection.protocol', 'nats',
            'connection.host', brokerHost,
            'connection.port', brokerPort,
            'credential.username', brokerUser,
            'credential.password', brokerPass,
            'credential.token', brokerToken,
        );        

        connection = new NatsConnection();
        connection.configure(config);
    });

    test('Open/Close', async () => {
        await connection.open(null);
        assert.isTrue(connection.isOpen());
        assert.isNotNull(connection.getConnection());

        await connection.close(null);
        assert.isFalse(connection.isOpen());
        assert.isNull(connection.getConnection());
    });

});