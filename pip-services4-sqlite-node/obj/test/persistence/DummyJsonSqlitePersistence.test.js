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
const process = require("process");
const DummyPersistenceFixture_1 = require("../fixtures/DummyPersistenceFixture");
const DummyJsonSqlitePersistence_1 = require("./DummyJsonSqlitePersistence");
const pip_services4_components_node_1 = require("pip-services4-components-node");
suite('DummyJsonSqlitePersistence', () => {
    let persistence;
    let fixture;
    let sqliteDatabase = process.env['SQLITE_DB'] || './data/test.db';
    if (sqliteDatabase == null) {
        return;
    }
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        let dbConfig = pip_services4_components_node_1.ConfigParams.fromTuples('connection.database', sqliteDatabase);
        persistence = new DummyJsonSqlitePersistence_1.DummyJsonSqlitePersistence();
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
//# sourceMappingURL=DummyJsonSqlitePersistence.test.js.map