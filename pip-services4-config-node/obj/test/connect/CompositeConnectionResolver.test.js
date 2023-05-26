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
const CompositeConnectionResolver_1 = require("../../src/connect/CompositeConnectionResolver");
suite('CompositeConnectionResolver', () => {
    test('Resolver', () => __awaiter(void 0, void 0, void 0, function* () {
        let config = pip_services4_components_node_1.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "localhost", "connection.port", 3000, "credential.username", "user", "credential.password", "pass");
        let connectionResolver = new CompositeConnectionResolver_1.CompositeConnectionResolver();
        connectionResolver.configure(config);
        let options = yield connectionResolver.resolve(null);
        assert.equal(options.get("protocol"), "http");
        assert.equal(options.get("host"), "localhost");
        assert.equal(options.get("port"), "3000");
    }));
});
//# sourceMappingURL=CompositeConnectionResolver.test.js.map