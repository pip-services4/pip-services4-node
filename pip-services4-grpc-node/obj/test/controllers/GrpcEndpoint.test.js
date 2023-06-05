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
const GrpcEndpoint_1 = require("../../src/controllers/GrpcEndpoint");
let grpcConfig = pip_services4_components_node_1.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "localhost", "connection.port", 3000);
suite('GrpcEndpoint', () => {
    let endpoint;
    suiteSetup(() => __awaiter(void 0, void 0, void 0, function* () {
        endpoint = new GrpcEndpoint_1.GrpcEndpoint();
        endpoint.configure(grpcConfig);
        yield endpoint.open(null);
    }));
    suiteTeardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield endpoint.close(null);
    }));
    test('Is Open', () => {
        assert.isTrue(endpoint.isOpen());
    });
});
//# sourceMappingURL=GrpcEndpoint.test.js.map