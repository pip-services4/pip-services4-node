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
const pip_services4_components_node_4 = require("pip-services4-components-node");
const StatusRestController_1 = require("../../src/controllers/StatusRestController");
let restConfig = pip_services4_components_node_2.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "localhost", "connection.port", 3000);
suite('StatusRestController', () => {
    let controller;
    let rest;
    suiteSetup(() => __awaiter(void 0, void 0, void 0, function* () {
        controller = new StatusRestController_1.StatusRestController();
        controller.configure(restConfig);
        let contextInfo = new pip_services4_components_node_4.ContextInfo();
        contextInfo.name = "Test";
        contextInfo.description = "This is a test container";
        let references = pip_services4_components_node_3.References.fromTuples(new pip_services4_components_node_1.Descriptor("pip-services", "context-info", "default", "default", "1.0"), contextInfo, new pip_services4_components_node_1.Descriptor("pip-services", "status-controller", "http", "default", "1.0"), controller);
        controller.setReferences(references);
        yield controller.open(null);
    }));
    suiteTeardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield controller.close(null);
    }));
    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });
    test('Status', () => __awaiter(void 0, void 0, void 0, function* () {
        let result = yield new Promise((resolve, reject) => {
            rest.get('/status', (err, req, res, result) => {
                if (err == null)
                    resolve(result);
                else
                    reject(err);
            });
        });
        assert.isNotNull(result);
    }));
});
//# sourceMappingURL=StatusRestController.test.js.map