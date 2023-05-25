"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const ConnectionUtils_1 = require("../../src/connect/ConnectionUtils");
suite('ConnectionUtils', () => {
    test('Parse URI', () => {
        let options = ConnectionUtils_1.ConnectionUtils.parseUri("http://localhost:8080/test?param1=abc", "http", 80);
        assert.equal("http", options.getAsString("protocol"));
        assert.equal("localhost", options.getAsString("host"));
        assert.equal(8080, options.getAsInteger("port"));
        assert.equal("test", options.getAsString("path"));
        assert.equal("abc", options.getAsString("param1"));
    });
    test('Compose URI', () => {
        let options = pip_services4_components_node_1.ConfigParams.fromTuples("protocol", "http", "host", "localhost", "port", 8080, "path", "test", "param1", "abc");
        let uri = ConnectionUtils_1.ConnectionUtils.composeUri(options, "http", 80);
        assert.equal("http://localhost:8080/test?param1=abc", uri);
    });
});
//# sourceMappingURL=ConnectionUtils.test.js.map