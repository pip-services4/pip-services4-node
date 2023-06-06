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
const pip_services4_components_node_1 = require("pip-services4-components-node");
const MqttConnectionResolver_1 = require("../../src/connect/MqttConnectionResolver");
suite('MqttConnectionResolver', () => {
    test('Single Connection', () => __awaiter(void 0, void 0, void 0, function* () {
        let resolver = new MqttConnectionResolver_1.MqttConnectionResolver();
        resolver.configure(pip_services4_components_node_1.ConfigParams.fromTuples("connection.protocol", "mqtt", "connection.host", "localhost", "connection.port", 1883));
        let connection = yield resolver.resolve(null);
        assert.equal("mqtt://localhost:1883", connection.uri);
        assert.isUndefined(connection.username);
        assert.isUndefined(connection.password);
    }));
    // test('Cluster Connection', (done) => {
    //     let resolver = new MqttConnectionResolver();
    //     resolver.configure(ConfigParams.fromTuples(
    //         "connections.0.protocol", "mqtt",
    //         "connections.0.host", "server1",
    //         "connections.0.port", 1883,
    //         "connections.1.protocol", "mqtt",
    //         "connections.1.host", "server2",
    //         "connections.1.port", 1883,
    //         "connections.2.protocol", "mqtt",
    //         "connections.2.host", "server3",
    //         "connections.2.port", 1883,
    //     ));
    //     resolver.resolve(null, (err, connection) => {
    //         assert.isNull(err);
    //         assert.isNotNull(connection.uri);
    //         assert.isUndefined(connection.username);
    //         assert.isUndefined(connection.password);
    //         done();
    //     });
    // });
    // test('Cluster Connection with Auth', (done) => {
    //     let resolver = new MqttConnectionResolver();
    //     resolver.configure(ConfigParams.fromTuples(
    //         "connections.0.protocol", "mqtt",
    //         "connections.0.host", "server1",
    //         "connections.0.port", 1883,
    //         "connections.1.protocol", "mqtt",
    //         "connections.1.host", "server2",
    //         "connections.1.port", 1883,
    //         "connections.2.protocol", "mqtt",
    //         "connections.2.host", "server3",
    //         "connections.2.port", 1883,
    //         "credential.username", "test",
    //         "credential.password", "pass123",
    //     ));
    //     resolver.resolve(null, (err, connection) => {
    //         assert.isNull(err);
    //         assert.isNotNull(connection.uri);
    //         assert.equal("test", connection.username);
    //         assert.equal("pass123", connection.password);
    //         done();
    //     });
    // });
    test('Cluster URI', () => __awaiter(void 0, void 0, void 0, function* () {
        let resolver = new MqttConnectionResolver_1.MqttConnectionResolver();
        resolver.configure(pip_services4_components_node_1.ConfigParams.fromTuples("connection.uri", "mqtt://server1:1883", "credential.username", "test", "credential.password", "pass123"));
        let connection = yield resolver.resolve(null);
        assert.isNotNull(connection.uri);
        assert.equal("test", connection.username);
        assert.equal("pass123", connection.password);
    }));
});
//# sourceMappingURL=MqttConnectionResolver.test.js.map