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
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const ConnectionParams_1 = require("../../src/connect/ConnectionParams");
const MemoryDiscovery_1 = require("../../src/connect/MemoryDiscovery");
suite('MemoryDiscovery', () => {
    let config = pip_services3_commons_node_1.ConfigParams.fromTuples("key1.host", "10.1.1.100", "key1.port", "8080", "key2.host", "10.1.1.101", "key2.port", "8082");
    test('Resolve connections', () => __awaiter(void 0, void 0, void 0, function* () {
        let discovery = new MemoryDiscovery_1.MemoryDiscovery();
        discovery.readConnections(config);
        // Resolve one
        let connection = yield discovery.resolveOne("123", "key1");
        assert.equal("10.1.1.100", connection.getHost());
        assert.equal(8080, connection.getPort());
        connection = yield discovery.resolveOne("123", "key2");
        assert.equal("10.1.1.101", connection.getHost());
        assert.equal(8082, connection.getPort());
        // Resolve all
        discovery.register(null, "key1", ConnectionParams_1.ConnectionParams.fromTuples("host", "10.3.3.151"));
        let connections = yield discovery.resolveAll("123", "key1");
        assert.isTrue(connections.length > 1);
    }));
});
//# sourceMappingURL=MemoryDiscovery.test.js.map