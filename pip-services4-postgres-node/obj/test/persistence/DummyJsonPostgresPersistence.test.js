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
const process = require('process');
const pip_services4_components_node_1 = require("pip-services4-components-node");
const DummyPersistenceFixture_1 = require("../fixtures/DummyPersistenceFixture");
const DummyJsonPostgresPersistence_1 = require("./DummyJsonPostgresPersistence");
suite('DummyJsonPostgresPersistence', () => {
    let persistence;
    let fixture;
    let postgresUri = process.env['POSTGRES_URI'];
    let postgresHost = process.env['POSTGRES_HOST'] || 'localhost';
    let postgresPort = process.env['POSTGRES_PORT'] || 5432;
    let postgresDatabase = process.env['POSTGRES_DB'] || 'test';
    let postgresUser = process.env['POSTGRES_USER'] || 'postgres';
    let postgresPassword = process.env['POSTGRES_PASSWORD'] || 'postgres';
    if (postgresUri == null && postgresHost == null) {
        return;
    }
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        let dbConfig = pip_services4_components_node_1.ConfigParams.fromTuples('connection.uri', postgresUri, 'connection.host', postgresHost, 'connection.port', postgresPort, 'connection.database', postgresDatabase, 'credential.username', postgresUser, 'credential.password', postgresPassword);
        persistence = new DummyJsonPostgresPersistence_1.DummyJsonPostgresPersistence();
        persistence.configure(dbConfig);
        fixture = new DummyPersistenceFixture_1.DummyPersistenceFixture(persistence);
        yield persistence.open(null);
        yield persistence.clear(null);
    }));
    teardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield persistence.close(null);
    }));
    test('Crud Operations', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testCrudOperations();
    }));
    test('Batch Operations', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testBatchOperations();
    }));
});
//# sourceMappingURL=DummyJsonPostgresPersistence.test.js.map