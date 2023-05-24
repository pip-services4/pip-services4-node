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
const MqttMessageQueue_1 = require("../../src/queues/MqttMessageQueue");
suite('MqttMessageQueue', () => {
    let queue;
    let fixture;
    let brokerHost = process.env['MQTT_SERVICE_HOST'] || 'localhost';
    let brokerPort = process.env['MQTT_SERVICE_PORT'] || 1883;
    let brokerTopic = process.env['MQTT_TOPIC'] || 'test';
    if (brokerHost == '' && brokerPort == '') {
        return;
    }
    let queueConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('topic', brokerTopic, 'connection.protocol', 'mqtt', 'connection.host', brokerHost, 'connection.port', brokerPort, 'options.autosubscribe', true, 'options.serialize_envelope', true);
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        queue = new MqttMessageQueue_1.MqttMessageQueue();
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
    test('Receive and Send Message', () => __awaiter(void 0, void 0, void 0, function* () {
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