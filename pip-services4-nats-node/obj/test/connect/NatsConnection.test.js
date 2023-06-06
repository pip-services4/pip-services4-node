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
const process = require("process");
const NatsConnection_1 = require("../../src/connect/NatsConnection");
const pip_services4_components_node_1 = require("pip-services4-components-node");
suite('NatsConnection', () => {
    let connection;
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
        let config = pip_services4_components_node_1.ConfigParams.fromTuples('queue', brokerQueue, 'connection.protocol', 'nats', 'connection.host', brokerHost, 'connection.port', brokerPort, 'credential.username', brokerUser, 'credential.password', brokerPass, 'credential.token', brokerToken);
        connection = new NatsConnection_1.NatsConnection();
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
//# sourceMappingURL=NatsConnection.test.js.map