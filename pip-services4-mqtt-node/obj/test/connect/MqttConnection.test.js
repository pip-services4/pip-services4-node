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
const assert = require('chai').assert;
const process = require('process');
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const MqttConnection_1 = require("../../src/connect/MqttConnection");
suite('MqttConnection', () => {
    let connection;
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
        let config = pip_services3_commons_node_1.ConfigParams.fromTuples('topic', brokerTopic, 'connection.protocol', 'mqtt', 'connection.host', brokerHost, 'connection.port', brokerPort, 'credential.username', brokerUser, 'credential.password', brokerPass, 'credential.token', brokerToken);
        connection = new MqttConnection_1.MqttConnection();
        connection.configure(config);
    });
    test('Open/Close', () => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.open(null);
        assert.isTrue(connection.isOpen());
        assert.isNotNull(connection.getConnection());
        yield connection.close(null);
        assert.isFalse(connection.isOpen());
        assert.isNull(connection.getConnection());
    }));
});
//# sourceMappingURL=MqttConnection.test.js.map