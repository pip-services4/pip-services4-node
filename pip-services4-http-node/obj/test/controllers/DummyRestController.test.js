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
const fs = require('fs');
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_data_node_1 = require("pip-services4-data-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const DummyService_1 = require("../sample/DummyService");
const DummyRestController_1 = require("./DummyRestController");
let restConfig = pip_services4_components_node_1.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "localhost", "connection.port", 3000, "swagger.enable", "true", "swagger.content", "swagger yaml or json content" // for test only
);
suite('DummyRestController', () => {
    let _dummy1;
    let _dummy2;
    let headers = {};
    let controller;
    let rest;
    suiteSetup(() => __awaiter(void 0, void 0, void 0, function* () {
        let service = new DummyService_1.DummyService();
        controller = new DummyRestController_1.DummyRestController();
        controller.configure(restConfig);
        let references = pip_services4_components_node_2.References.fromTuples(new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', 'default', '1.0'), service, new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'controller', 'rest', 'default', '1.0'), controller);
        controller.setReferences(references);
        yield controller.open(null);
    }));
    suiteTeardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield controller.close(null);
    }));
    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*', headers: headers });
        _dummy1 = { id: null, key: "Key 1", content: "Content 1", array: [{ key: "SubKey 1", content: "SubContent 1" }] };
        _dummy2 = { id: null, key: "Key 2", content: "Content 2", array: [{ key: "SubKey 1", content: "SubContent 1" }] };
    });
    test('CRUD Operations', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create one dummy
        let dummy = yield new Promise((resolve, reject) => {
            rest.post('/dummies', _dummy1, (err, req, res, result) => {
                if (err == null)
                    resolve(result);
                else
                    reject(err);
            });
        });
        assert.isObject(dummy);
        assert.equal(dummy.content, _dummy1.content);
        assert.equal(dummy.key, _dummy1.key);
        let dummy1 = dummy;
        // Create another dummy
        dummy = yield new Promise((resolve, reject) => {
            rest.post('/dummies', _dummy2, (err, req, res, result) => {
                if (err == null)
                    resolve(result);
                else
                    reject(err);
            });
        });
        assert.isObject(dummy);
        assert.equal(dummy.content, _dummy2.content);
        assert.equal(dummy.key, _dummy2.key);
        // Get all dummies
        let dummies = yield new Promise((resolve, reject) => {
            rest.get('/dummies', (err, req, res, result) => {
                if (err == null)
                    resolve(result);
                else
                    reject(err);
            });
        });
        assert.isObject(dummies);
        assert.lengthOf(dummies.data, 2);
        // Get dummy 1 by filter param
        dummies = yield new Promise((resolve, reject) => {
            rest.get('/dummies?filter=key=Key%201', (err, req, res, result) => {
                if (err == null)
                    resolve(result);
                else
                    reject(err);
            });
        });
        assert.isObject(dummies);
        assert.lengthOf(dummies.data, 1);
        assert.equal(dummies.data[0].key, _dummy1.key);
        // Get dummy 2 by query param
        dummies = yield new Promise((resolve, reject) => {
            rest.get('/dummies?key=Key%202', (err, req, res, result) => {
                if (err == null)
                    resolve(result);
                else
                    reject(err);
            });
        });
        assert.isObject(dummies);
        assert.lengthOf(dummies.data, 1);
        assert.equal(dummies.data[0].key, _dummy2.key);
        // Update the dummy
        dummy1.content = 'Updated Content 1';
        dummy = yield new Promise((resolve, reject) => {
            rest.put('/dummies', dummy1, (err, req, res, result) => {
                if (err == null)
                    resolve(result);
                else
                    reject(err);
            });
        });
        assert.isObject(dummy);
        assert.equal(dummy.content, 'Updated Content 1');
        assert.equal(dummy.key, _dummy1.key);
        dummy1 = dummy;
        // Delete dummy
        yield new Promise((resolve, reject) => {
            rest.del('/dummies/' + dummy1.id, (err, req, res, result) => {
                if (err == null)
                    resolve(result);
                else
                    reject(err);
            });
        });
        // Try to get deleted dummy
        dummy = yield new Promise((resolve, reject) => {
            rest.get('/dummies/' + dummy1.id, (err, req, res, result) => {
                if (err == null)
                    resolve(result || null);
                else
                    reject(err);
            });
        });
        // assert.isNull(dummy);
    }));
    test('Failed Validation', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create one dummy with an invalid id
        let dummy = yield new Promise((resolve, reject) => {
            rest.post('/dummies', {}, (err, req, res, result) => {
                assert.equal(err.restCode, 'INVALID_DATA');
                if (err != null)
                    resolve(err);
                else
                    reject(dummy);
            });
        });
    }));
    test('Check context', () => __awaiter(void 0, void 0, void 0, function* () {
        // check transmit correllationId over params
        let result = yield new Promise((resolve, reject) => {
            rest.get("/dummies/check/trace_id?trace_id=test_cor_id", (err, req, res, result) => {
                if (err == null)
                    resolve(result);
                else
                    reject(err);
            });
        });
        assert.equal("test_cor_id", result.trace_id);
        // check transmit correllationId over header
        result = yield new Promise((resolve, reject) => {
            headers["trace_id"] = "test_cor_id_header";
            rest.get("/dummies/check/trace_id", (err, req, res, result) => {
                if (err == null)
                    resolve(result);
                else
                    reject(err);
            });
        });
        assert.equal(controller.getNumberOfCalls(), 5); // Check interceptor
        assert.equal("test_cor_id_header", result.trace_id);
    }));
    test('Get OpenApi Spec From String', () => __awaiter(void 0, void 0, void 0, function* () {
        let client = restify.createStringClient({ url: 'http://localhost:3000', version: '*' });
        let result = yield new Promise((resolve, reject) => {
            rest.get("/swagger", (err, req, res) => {
                // if (err == null) resolve(res.body);
                // else reject(err);
                resolve(res.body);
            });
        });
        let openApiContent = restConfig.getAsString("swagger.content");
        assert.equal(openApiContent, result);
    }));
    test('Get OpenApi Spec From File', () => __awaiter(void 0, void 0, void 0, function* () {
        let openApiContent = "swagger yaml content from file";
        let filename = 'dummy_' + pip_services4_data_node_1.IdGenerator.nextLong() + '.tmp';
        let client = restify.createStringClient({ url: 'http://localhost:3000', version: '*' });
        // create temp file
        yield new Promise((resolve, reject) => {
            fs.writeFile(filename, openApiContent, (err) => {
                if (err == null)
                    resolve(null);
                else
                    reject(err);
            });
        });
        // recreate service with new configuration
        yield controller.close(null);
        let serviceConfig = pip_services4_components_node_1.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "localhost", "connection.port", 3000, "swagger.enable", "true", "swagger.path", filename // for test only
        );
        let service = new DummyService_1.DummyService();
        controller = new DummyRestController_1.DummyRestController();
        controller.configure(serviceConfig);
        let references = pip_services4_components_node_2.References.fromTuples(new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', 'default', '1.0'), service, new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'controller', 'rest', 'default', '1.0'), controller);
        controller.setReferences(references);
        yield controller.open(null);
        let content = yield new Promise((resolve, reject) => {
            client.get("/swagger", (err, req, res) => {
                if (err == null)
                    resolve(res.body);
                else
                    reject(err);
            });
        });
        assert.equal(openApiContent, content);
        // delete temp file
        yield new Promise((resolve, reject) => {
            fs.unlink(filename, (err) => {
                if (err == null)
                    resolve(null);
                else
                    reject(err);
            });
        });
    }));
});
//# sourceMappingURL=DummyRestController.test.js.map