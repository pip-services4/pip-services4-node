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
const AzureFunctionConnectionParams_1 = require("../../src/connect/AzureFunctionConnectionParams");
const AzureFunctionConnectionResolver_1 = require("../../src/connect/AzureFunctionConnectionResolver");
suite('AzureConnectionParams', () => {
    test('Test Empty Connection', () => __awaiter(void 0, void 0, void 0, function* () {
        let connection = new AzureFunctionConnectionParams_1.AzureFunctionConnectionParams();
        assert.isNull(connection.getFunctionUri());
        assert.isNull(connection.getAppName());
        assert.isNull(connection.getFunctionName());
        assert.isNull(connection.getAuthCode());
        assert.isNull(connection.getProtocol());
    }));
    test('Compose Config', () => __awaiter(void 0, void 0, void 0, function* () {
        const config1 = pip_services4_components_node_1.ConfigParams.fromTuples('connection.uri', 'http://myapp.azurewebsites.net/api/myfunction', 'credential.auth_code', '1234');
        const config2 = pip_services4_components_node_1.ConfigParams.fromTuples('connection.protocol', 'http', 'connection.app_name', 'myapp', 'connection.function_name', 'myfunction', 'credential.auth_code', '1234');
        let resolver = new AzureFunctionConnectionResolver_1.AzureFunctionConnectionResolver();
        resolver.configure(config1);
        let connection = yield resolver.resolve(null);
        assert.equal('http://myapp.azurewebsites.net/api/myfunction', connection.getFunctionUri());
        assert.equal('myapp', connection.getAppName());
        assert.equal('http', connection.getProtocol());
        assert.equal('myfunction', connection.getFunctionName());
        assert.equal('1234', connection.getAuthCode());
        resolver = new AzureFunctionConnectionResolver_1.AzureFunctionConnectionResolver();
        resolver.configure(config2);
        connection = yield resolver.resolve(null);
        assert.equal('http://myapp.azurewebsites.net/api/myfunction', connection.getFunctionUri());
        assert.equal('http', connection.getProtocol());
        assert.equal('myapp', connection.getAppName());
        assert.equal('myfunction', connection.getFunctionName());
        assert.equal('1234', connection.getAuthCode());
    }));
});
//# sourceMappingURL=AzureConnectionParams.test.js.map