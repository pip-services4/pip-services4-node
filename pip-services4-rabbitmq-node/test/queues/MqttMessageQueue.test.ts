const process = require('process');

import { MessageQueueFixture } from './MessageQueueFixture';
import { RabbitMQMessageQueue } from '../../src/queues/RabbitMQMessageQueue';
import { ConfigParams } from 'pip-services4-components-node';

suite('RabbitMQMessageQueue', ()=> {
    let queue: RabbitMQMessageQueue;
    let fixture: MessageQueueFixture;

    let rabbitmqHost = process.env['RABBITMQ_SERVICE_HOST'] || 'localhost';
    let rabbitmqPort = process.env['RABBITMQ_SERVICE_PORT'] || 5672;
    let rabbitmqExchange = process.env["RABBITMQ_EXCHANGE"] || "test";
    let rabbitmqQueue = process.env["RABBITMQ_QUEUE"] || "test";
    let rabbitmqUser = process.env["RABBITMQ_USER"] || "user";
    let rabbitmqPassword = process.env["RABBITMQ_PASS"] || "password";

    if (rabbitmqHost == "" && rabbitmqPort == "") {
        return;
    }
    
    let queueConfig = ConfigParams.fromTuples(
        "exchange", rabbitmqExchange,
        "queue", rabbitmqQueue,
        "options.auto_create", true,
        //"connection.protocol", "amqp",
        "connection.host", rabbitmqHost,
        "connection.port", rabbitmqPort,
        "credential.username", rabbitmqUser,
        "credential.password", rabbitmqPassword,
    );

    setup(async () => {
        queue = new RabbitMQMessageQueue('testQueue');
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

    test('Receive abandon message', async () => {
        await fixture.testReceiveAbandonMessage();
    });

    test('Receive And Complete Message', async () => {
        await fixture.testReceiveCompleteMessage();
    });

    test('Receive Send Message', async () => {
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