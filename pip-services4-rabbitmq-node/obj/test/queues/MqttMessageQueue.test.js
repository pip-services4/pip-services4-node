"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const process = require('process');
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const MessageQueueFixture_1 = require("./MessageQueueFixture");
const RabbitMQMessageQueue_1 = require("../../src/queues/RabbitMQMessageQueue");
suite('RabbitMQMessageQueue', () => {
    let queue;
    let fixture;
    let rabbitmqHost = process.env['RABBITMQ_SERVICE_HOST'] || 'localhost';
    let rabbitmqPort = process.env['RABBITMQ_SERVICE_PORT'] || 5672;
    let rabbitmqExchange = process.env["RABBITMQ_EXCHANGE"] || "test";
    let rabbitmqQueue = process.env["RABBITMQ_QUEUE"] || "test";
    let rabbitmqUser = process.env["RABBITMQ_USER"] || "user";
    let rabbitmqPassword = process.env["RABBITMQ_PASS"] || "password";
    if (rabbitmqHost == "" && rabbitmqPort == "") {
        return;
    }
    let queueConfig = pip_services3_commons_node_1.ConfigParams.fromTuples("exchange", rabbitmqExchange, "queue", rabbitmqQueue, "options.auto_create", true, 
    //"connection.protocol", "amqp",
    "connection.host", rabbitmqHost, "connection.port", rabbitmqPort, "credential.username", rabbitmqUser, "credential.password", rabbitmqPassword);
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        queue = new RabbitMQMessageQueue_1.RabbitMQMessageQueue('testQueue');
        queue.configure(queueConfig);
        fixture = new MessageQueueFixture_1.MessageQueueFixture(queue);
        yield queue.open(null);
        yield queue.clear(null);
    }));
    teardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield queue.close(null);
    }));
    test('Send and Receive Message', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testSendReceiveMessage();
    }));
    test('Receive abandon message', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testReceiveAbandonMessage();
    }));
    test('Receive And Complete Message', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testReceiveCompleteMessage();
    }));
    test('Receive Send Message', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testReceiveSendMessage();
    }));
    test('Send Peek Message', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testSendPeekMessage();
    }));
    test('Peek No Message', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testPeekNoMessage();
    }));
    test('On Message', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testOnMessage();
    }));
});
//# sourceMappingURL=MqttMessageQueue.test.js.map