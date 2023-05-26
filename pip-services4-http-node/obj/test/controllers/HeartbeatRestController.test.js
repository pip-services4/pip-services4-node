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
const HeartbeatRestController_1 = require("../../src/controllers/HeartbeatRestController");
let restConfig = pip_services4_components_node_1.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "localhost", "connection.port", 3000);
suite('HeartbeatRestController', () => {
    let controller;
    let rest;
    suiteSetup(() => __awaiter(void 0, void 0, void 0, function* () {
        controller = new HeartbeatRestController_1.HeartbeatRestController();
        controller.configure(restConfig);
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
            rest.get('/heartbeat', (err, req, res, result) => {
                if (err == null)
                    resolve(result);
                else
                    reject(err);
            });
        });
        assert.isNotNull(result);
    }));
});
//# sourceMappingURL=HeartbeatRestController.test.js.map