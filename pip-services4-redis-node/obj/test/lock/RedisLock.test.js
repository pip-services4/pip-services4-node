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
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const RedisLock_1 = require("../../src/lock/RedisLock");
const LockFixture_1 = require("../fixtures/LockFixture");
suite('RedisLock', () => {
    let _lock;
    let _fixture;
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        let host = process.env['REDIS_SERVICE_HOST'] || 'localhost';
        let port = process.env['REDIS_SERVICE_PORT'] || 6379;
        _lock = new RedisLock_1.RedisLock();
        let config = pip_services3_commons_node_1.ConfigParams.fromTuples('connection.host', host, 'connection.port', port);
        _lock.configure(config);
        _fixture = new LockFixture_1.LockFixture(_lock);
        yield _lock.open(null);
    }));
    teardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield _lock.close(null);
    }));
    test('Try Acquire Lock', () => __awaiter(void 0, void 0, void 0, function* () {
        yield _fixture.testTryAcquireLock();
    }));
    test('Acquire Lock', () => __awaiter(void 0, void 0, void 0, function* () {
        yield _fixture.testAcquireLock();
    }));
    test('Release Lock', () => __awaiter(void 0, void 0, void 0, function* () {
        yield _fixture.testReleaseLock();
    }));
});
//# sourceMappingURL=RedisLock.test.js.map