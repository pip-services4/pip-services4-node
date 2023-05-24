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
const PostgresConnectionResolver_1 = require("../../src/connect/PostgresConnectionResolver");
suite('PostgresConnectionResolver', () => {
    test('Connection Config', () => __awaiter(void 0, void 0, void 0, function* () {
        let dbConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('connection.host', 'localhost', 'connection.port', 5432, 'connection.database', 'test', 'connection.ssl', true, 'credential.username', 'postgres', 'credential.password', 'postgres');
        let resolver = new PostgresConnectionResolver_1.PostgresConnectionResolver();
        resolver.configure(dbConfig);
        let config = yield resolver.resolve(null);
        assert.isObject(config);
        assert.equal('localhost', config.host);
        assert.equal(5432, config.port);
        assert.equal('test', config.database);
        assert.equal('postgres', config.user);
        assert.equal('postgres', config.password);
        assert.isUndefined(config.ssl);
    }));
});
//# sourceMappingURL=PostgresConnectionResolver.test.js.map