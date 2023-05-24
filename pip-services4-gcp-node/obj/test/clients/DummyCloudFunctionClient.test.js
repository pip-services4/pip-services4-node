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
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const DummyClientFixture_1 = require("./DummyClientFixture");
const DummyCloudFunctionClient_1 = require("./DummyCloudFunctionClient");
suite('DummyCloudFunctionClient', () => {
    let functionName = process.env['GCP_FUNCTION_NAME'];
    let protocol = process.env['GCP_FUNCTION_PROTOCOL'];
    let region = process.env['GCP_FUNCTION_REGION'];
    let projectId = process.env['GCP_PROJECT_ID'];
    let uri = process.env['GCP_FUNCTION_URI'] || 'http://localhost:3007';
    if (!uri && (!region || !functionName || !protocol || !projectId)) {
        return;
    }
    let config = pip_services3_commons_node_1.ConfigParams.fromTuples('connection.uri', uri, 'connection.protocol', protocol, 'connection.region', region, 'connection.function', functionName, 'connection.project_id', projectId);
    let client;
    let fixture;
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        client = new DummyCloudFunctionClient_1.DummyCloudFunctionClient();
        client.configure(config);
        fixture = new DummyClientFixture_1.DummyClientFixture(client, 'handler', 3007);
        if (uri == 'http://localhost:3007')
            yield fixture.startCloudServiceLocally();
        yield client.open(null);
    }));
    teardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield client.close(null);
        if (uri == 'http://localhost:3007')
            yield fixture.stopCloudServiceLocally();
    }));
    test('Crud Operations', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testCrudOperations();
    }));
});
//# sourceMappingURL=DummyCloudFunctionClient.test.js.map