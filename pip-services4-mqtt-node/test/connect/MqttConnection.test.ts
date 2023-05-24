const assert = require('chai').assert;
const process = require('process');

import { ConfigParams } from 'pip-services4-commons-node';

import { MqttConnection } from '../../src/connect/MqttConnection';

suite('MqttConnection', ()=> {
    let connection: MqttConnection;

    let brokerHost = process.env['MQTT_SERVICE_HOST'] || 'localhost';
    let brokerPort = process.env['MQTT_SERVICE_PORT'] || 1883;
    if (brokerHost == '' && brokerPort == '') {
        return;
    }
    let brokerTopic = process.env['MQTT_TOPIC'] || 'test';
    let brokerUser = process.env['MQTT_USER'];
    let brokerPass = process.env['MQTT_PASS'];
    let brokerToken = process.env['MQTT_TOKEN'];

    setup(() => {
        let config = ConfigParams.fromTuples(
            'topic', brokerTopic,
            'connection.protocol', 'mqtt',
            'connection.host', brokerHost,
            'connection.port', brokerPort,
            'credential.username', brokerUser,
            'credential.password', brokerPass,
            'credential.token', brokerToken,
        );        

        connection = new MqttConnection();
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