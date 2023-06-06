import process = require('process');

import { MessageQueueFixture } from './MessageQueueFixture';
import { MqttMessageQueue } from '../../src/queues/MqttMessageQueue';
import { ConfigParams } from 'pip-services4-components-node';

suite('MqttMessageQueue', ()=> {
    let queue: MqttMessageQueue;
    let fixture: MessageQueueFixture;

    let brokerHost = process.env['MQTT_SERVICE_HOST'] || 'localhost';
    let brokerPort = process.env['MQTT_SERVICE_PORT'] || 1883;
    let brokerTopic = process.env['MQTT_TOPIC'] || 'test';
    if (brokerHost == '' && brokerPort == '') {
        return;
    }
    
    let queueConfig = ConfigParams.fromTuples(
        'topic', brokerTopic,
        'connection.protocol', 'mqtt',
        'connection.host', brokerHost,
        'connection.port', brokerPort,
        'options.autosubscribe', true,
        'options.serialize_envelope', true
    );

    setup(async () => {
        queue = new MqttMessageQueue();
        queue.configure(queueConfig);

        fixture = new MessageQueueFixture(queue);

        await queue.open(null);
        await queue.clear(null);
    });

    teardown(async () => {
        await queue.close(null);
    });

    test('Send and Receive Message', async () => {
        await fixture.testSendReceiveMessage();
     });
 
    test('Receive and Send Message', async () => {
       await fixture.testReceiveSendMessage();
    });

    test('Send Peek Message', async () => {
        await fixture.testSendPeekMessage();
    });

    test('Peek No Message', async () => {
        await fixture.testPeekNoMessage();
    });
      
    test('On Message', async () => {
        await fixture.testOnMessage();
    });

});