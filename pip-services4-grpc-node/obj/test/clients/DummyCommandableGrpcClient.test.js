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
const DummyCommandableGrpcController_1 = require("../controllers/DummyCommandableGrpcController");
const DummyCommandableGrpcClient_1 = require("./DummyCommandableGrpcClient");
const DummyClientFixture_1 = require("./DummyClientFixture");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const DummyService_1 = require("../sample/DummyService");
let grpcConfig = pip_services4_components_node_1.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "localhost", "connection.port", 3002);
suite('DummyCommandableGrpcClient', () => {
    let controller;
    let client;
    let fixture;
    suiteSetup(() => __awaiter(void 0, void 0, void 0, function* () {
        let service = new DummyService_1.DummyService();
        controller = new DummyCommandableGrpcController_1.DummyCommandableGrpcController();
        controller.configure(grpcConfig);
        let references = pip_services4_components_node_1.References.fromTuples(new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', 'default', '1.0'), service, new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'controller', 'grpc', 'default', '1.0'), controller);
        controller.setReferences(references);
        yield controller.open(null);
    }));
    suiteTeardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield controller.close(null);
    }));
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        client = new DummyCommandableGrpcClient_1.DummyCommandableGrpcClient();
        fixture = new DummyClientFixture_1.DummyClientFixture(client);
        client.configure(grpcConfig);
        client.setReferences(new pip_services4_components_node_1.References());
        yield client.open(null);
    }));
    test('CRUD Operations', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testCrudOperations();
    }));
});
//# sourceMappingURL=DummyCommandableGrpcClient.test.js.map