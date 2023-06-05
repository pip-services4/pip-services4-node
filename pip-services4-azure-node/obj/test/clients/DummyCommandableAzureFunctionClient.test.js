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
let process = require('process');
const pip_services4_components_node_1 = require("pip-services4-components-node");
const DummyClientFixture_1 = require("../DummyClientFixture");
const DummyCommandableAzureFunctionClient_1 = require("./DummyCommandableAzureFunctionClient");
suite('DummyCommandableAzureFunctionClient', () => {
    let appName = process.env['AZURE_FUNCTION_APP_NAME'];
    let functionName = process.env['AZURE_FUNCTION_NAME'];
    let protocol = process.env['AZURE_FUNCTION_PROTOCOL'];
    let authCode = process.env['AZURE_FUNCTION_AUTH_CODE'];
    let uri = process.env['AZURE_FUNCTION_URI'];
    if (!uri && (!appName || !functionName || !protocol || !authCode)) {
        return;
    }
    let config = pip_services4_components_node_1.ConfigParams.fromTuples('connection.uri', uri, 'connection.protocol', protocol, 'connection.app_name', appName, 'connection.function_name', functionName, 'credential.auth_code', authCode);
    let client;
    let fixture;
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        client = new DummyCommandableAzureFunctionClient_1.DummyCommandableAzureFunctionClient();
        client.configure(config);
        fixture = new DummyClientFixture_1.DummyClientFixture(client);
        yield client.open(null);
    }));
    teardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield client.close(null);
    }));
    test('Crud Operations', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testCrudOperations();
    }));
});
//# sourceMappingURL=DummyCommandableAzureFunctionClient.test.js.map