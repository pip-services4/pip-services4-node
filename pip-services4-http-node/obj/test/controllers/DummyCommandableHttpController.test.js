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
const DummyService_1 = require("../sample/DummyService");
const DummyCommandableHttpController_1 = require("./DummyCommandableHttpController");
// import * as fs from 'fs';
suite('DummyCommandableHttpController', () => {
    let _dummy1;
    let _dummy2;
    let headers = {};
    let controller;
    let rest;
    let restConfig = pip_services4_components_node_2.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "localhost", "connection.port", 3000, "swagger.enable", "true");
    suiteSetup(() => __awaiter(void 0, void 0, void 0, function* () {
        let service = new DummyService_1.DummyService();
        controller = new DummyCommandableHttpController_1.DummyCommandableHttpController();
        controller.configure(restConfig);
        let references = pip_services4_components_node_3.References.fromTuples(new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', 'default', '1.0'), service, new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'controller', 'http', 'default', '1.0'), controller);
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
            rest.post('/dummy/create_dummy', {
                dummy: _dummy1
            }, (err, req, res, dummy) => {
                if (err == null)
                    resolve(dummy);
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
            rest.post('/dummy/create_dummy', {
                dummy: _dummy2
            }, (err, req, res, dummy) => {
                if (err == null)
                    resolve(dummy);
                else
                    reject(err);
            });
        });
        assert.isObject(dummy);
        assert.equal(dummy.content, _dummy2.content);
        assert.equal(dummy.key, _dummy2.key);
        let dummy2 = dummy;
        // Get all dummies
        let dummies = yield new Promise((resolve, reject) => {
            rest.post('/dummy/get_dummies', null, (err, req, res, dummies) => {
                if (err == null)
                    resolve(dummies);
                else
                    reject(err);
            });
        });
        assert.isObject(dummies);
        assert.lengthOf(dummies.data, 2);
        // Update the dummy
        dummy1.content = 'Updated Content 1';
        dummy = yield new Promise((resolve, reject) => {
            rest.post('/dummy/update_dummy', {
                dummy: dummy1
            }, (err, req, res, dummy) => {
                if (err == null)
                    resolve(dummy);
                else
                    reject(err);
            });
        });
        assert.isObject(dummy);
        assert.equal(dummy.content, 'Updated Content 1');
        assert.equal(dummy.key, _dummy1.key);
        dummy1 = dummy;
        // Get the dummy by id
        dummy = yield new Promise((resolve, reject) => {
            rest.post('/dummy/get_dummy_by_id', {
                dummy_id: dummy1.id
            }, (err, req, res, dummy) => {
                if (err == null)
                    resolve(dummy);
                else
                    reject(err);
            });
        });
        assert.isObject(dummy);
        assert.equal(dummy.id, dummy1.id);
        assert.equal(dummy.key, _dummy1.key);
        // Delete dummy
        dummy = yield new Promise((resolve, reject) => {
            rest.post('/dummy/delete_dummy', {
                dummy_id: dummy1.id
            }, (err, req, res, dummy) => {
                if (err == null)
                    resolve(dummy);
                else
                    reject(err);
            });
        });
        // Try to get delete dummy
        dummy = yield new Promise((resolve, reject) => {
            rest.post('/dummy/get_dummy_by_id', {
                dummy_id: dummy1.id
            }, (err, req, res, dummy) => {
                if (err == null)
                    resolve(dummy);
                else
                    reject(err);
            });
        });
        // assert.isObject(dummy);
    }));
    test('Failed Validation', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create one dummy with an invalid id
        let dummy = yield new Promise((resolve, reject) => {
            rest.post('/dummy/create_dummy', {}, (err, req, res, dummy) => {
                assert.equal(err.restCode, 'INVALID_DATA');
                if (err != null)
                    resolve(err);
                else
                    reject(dummy);
            });
        });
    }));
    test('Check context', () => __awaiter(void 0, void 0, void 0, function* () {
        // check transmit trace_id over params
        let result = yield new Promise((resolve, reject) => {
            rest.post("/dummy/check_trace_id?trace_id=test_cor_id", null, (err, req, res, result) => {
                if (err == null)
                    resolve(result);
                else
                    reject(err);
            });
        });
        assert.equal("test_cor_id", result["trace_id"]);
        // check transmit trace_id over header
        headers["trace_id"] = "test_cor_id_header";
        result = yield new Promise((resolve, reject) => {
            rest.post("/dummy/check_trace_id", null, (err, req, res, result) => {
                if (err == null)
                    resolve(result);
                else
                    reject(err);
            });
        });
        assert.equal("test_cor_id_header", result["trace_id"]);
    }));
    test('Get OpenApi Spec', () => __awaiter(void 0, void 0, void 0, function* () {
        let url = 'http://localhost:3000';
        let client = restify.createStringClient({ url: url, version: '*' });
        let result = yield new Promise((resolve, reject) => {
            client.get("/dummy/swagger", (err, req, res) => {
                resolve(res.body);
            });
        });
        // uncomment and copy to editor.swagger.io for check
        // fs.writeFile('file.txt', result,  function(err) {
        //     if (err) {
        //         return console.error(err);
        //     }
        //     console.log("File created!");
        // });
        assert.isTrue(result.startsWith("openapi:"));
    }));
    test('OpenApi Spec Override', () => __awaiter(void 0, void 0, void 0, function* () {
        let openApiContent = "swagger yaml content";
        let url = 'http://localhost:3000';
        let client = restify.createStringClient({ url: url, version: '*' });
        // recreate service with new configuration
        yield controller.close(null);
        let config = restConfig.setDefaults(pip_services4_components_node_2.ConfigParams.fromTuples("swagger.auto", false));
        let service = new DummyService_1.DummyService();
        controller = new DummyCommandableHttpController_1.DummyCommandableHttpController();
        controller.configure(config);
        let references = pip_services4_components_node_3.References.fromTuples(new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', 'default', '1.0'), service, new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'controller', 'http', 'default', '1.0'), controller);
        controller.setReferences(references);
        yield controller.open(null);
        let result = yield new Promise((resolve, reject) => {
            client.get("/dummy/swagger", (err, req, res) => {
                resolve(res.body);
            });
        });
        assert.equal(openApiContent, result);
        yield controller.close(null);
    }));
});
//# sourceMappingURL=DummyCommandableHttpController.test.js.map