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
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const GcpConnectionParams_1 = require("../../src/connect/GcpConnectionParams");
const GcpConnectionResolver_1 = require("../../src/connect/GcpConnectionResolver");
suite('GcpConnectionParams', () => {
    test('Test Empty Connection', () => __awaiter(void 0, void 0, void 0, function* () {
        let connection = new GcpConnectionParams_1.GcpConnectionParams();
        assert.isNull(connection.getUri());
        assert.isNull(connection.getProjectId());
        assert.isNull(connection.getFunction());
        assert.isNull(connection.getRegion());
        assert.isNull(connection.getProtocol());
        assert.isNull(connection.getAuthToken());
    }));
    test('Compose Config', () => __awaiter(void 0, void 0, void 0, function* () {
        const config1 = pip_services3_commons_node_1.ConfigParams.fromTuples('connection.uri', 'http://east-my_test_project.cloudfunctions.net/myfunction', 'credential.auth_token', '1234');
        const config2 = pip_services3_commons_node_1.ConfigParams.fromTuples('connection.protocol', 'http', 'connection.region', 'east', 'connection.function', 'myfunction', 'connection.project_id', 'my_test_project', 'credential.auth_token', '1234');
        let resolver = new GcpConnectionResolver_1.GcpConnectionResolver();
        resolver.configure(config1);
        let connection = yield resolver.resolve('');
        assert.equal('http://east-my_test_project.cloudfunctions.net/myfunction', connection.getUri());
        assert.equal('east', connection.getRegion());
        assert.equal('http', connection.getProtocol());
        assert.equal('myfunction', connection.getFunction());
        assert.equal('my_test_project', connection.getProjectId());
        assert.equal('1234', connection.getAuthToken());
        resolver = new GcpConnectionResolver_1.GcpConnectionResolver();
        resolver.configure(config2);
        connection = yield resolver.resolve('');
        assert.equal('http://east-my_test_project.cloudfunctions.net/myfunction', connection.getUri());
        assert.equal('east', connection.getRegion());
        assert.equal('http', connection.getProtocol());
        assert.equal('myfunction', connection.getFunction());
        assert.equal('my_test_project', connection.getProjectId());
        assert.equal('1234', connection.getAuthToken());
    }));
});
//# sourceMappingURL=CloudConnectionParams.test.js.map