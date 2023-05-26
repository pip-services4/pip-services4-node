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
const restify = require('restify-clients');
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const pip_services4_components_node_3 = require("pip-services4-components-node");
const HttpEndpoint_1 = require("../../src/controllers/HttpEndpoint");
const DummyService_1 = require("../sample/DummyService");
const DummyRestController_1 = require("./DummyRestController");
let restConfig = pip_services4_components_node_2.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "localhost", "connection.port", 3000);
suite('HttpEndpoint', () => {
    let _dummy1;
    let _dummy2;
    let endpoint;
    let controller;
    let rest;
    suiteSetup(() => __awaiter(void 0, void 0, void 0, function* () {
        let service = new DummyService_1.DummyService();
        controller = new DummyRestController_1.DummyRestController();
        controller.configure(pip_services4_components_node_2.ConfigParams.fromTuples('base_route', '/api/v1'));
        endpoint = new HttpEndpoint_1.HttpEndpoint();
        endpoint.configure(restConfig);
        let references = pip_services4_components_node_3.References.fromTuples(new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', 'default', '1.0'), service, new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'controller', 'rest', 'default', '1.0'), controller, new pip_services4_components_node_1.Descriptor('pip-services', 'endpoint', 'http', 'default', '1.0'), endpoint);
        controller.setReferences(references);
        yield endpoint.open(null);
        yield controller.open(null);
    }));
    suiteTeardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield controller.close(null);
        yield endpoint.close(null);
    }));
    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
        _dummy1 = { id: null, key: "Key 1", content: "Content 1", array: [{ key: "SubKey 1", content: "SubContent 1" }] };
        _dummy2 = { id: null, key: "Key 2", content: "Content 2", array: [{ key: "SubKey 1", content: "SubContent 1" }] };
    });
    test('CRUD Operations', (done) => {
        rest.get('/api/v1/dummies', (err, req, res, dummies) => {
            assert.isNull(err);
            assert.isObject(dummies);
            assert.lengthOf(dummies.data, 0);
            done();
        });
    });
});
//# sourceMappingURL=HttpEndpoint.test.js.map